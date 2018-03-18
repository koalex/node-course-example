import * as AT from '../actionTypes';

export function sendMessage (message) {
	return {
		type: AT.CHAT_SEND_MESSAGE,
		data: message,
		CALL_API: {
			endpoint: '/api/v1/chat/messages',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {
				message
			},
			success_type: AT.CHAT_SEND_MESSAGE_SUCCESS,
			error_type: AT.CHAT_SEND_MESSAGE_ERROR
		}
	}
}
