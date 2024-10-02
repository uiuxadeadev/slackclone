import React, { ChangeEvent, useState } from 'react';
import { createChannel, postChannel } from '../../features/channel/channelAPI';

type Props = { handleCloseModal: () => void };

export const ChannelAddModal = ({ handleCloseModal }: Props) => {
  const [channelName, setChannelName] = useState('');

  const handleChannelNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value);
  };

  const handleAddChannel = async () => {
    if (!channelName.trim()) return;

    try {
      await postChannel(createChannel(channelName));
      setChannelName('');
      handleCloseModal();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white"
      onClick={handleCloseModal}
    >
      <div className="bg-gray-700 rounded-lg shadow-xl w-1/2" onClick={handleModalClick}>
        <div className="border-b px-4 py-2 flex justify-between items-center">
          <h3 className="font-semibold text-lg">Create a channel</h3>
          <button className="text-black close-modal" onClick={handleCloseModal}>
            &times;
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            className="border rounded w-full py-2 px-3 text-grey-darkest text-black"
            placeholder="名前"
            onChange={handleChannelNameChange}
          />
          <p className="text-sm text-grey mt-4">
            A channel is a space where conversations take place on specific topics. Please use a name that is easy to
            find and understand.
          </p>
        </div>
        <div className="flex justify-end items-center w-100 border-t p-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddChannel}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelAddModal;
