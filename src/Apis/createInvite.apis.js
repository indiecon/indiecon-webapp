import generateCustomHeader from '../Utils/generateCustomHeader.utils';

const createInvite = async ({
	authToken,
	inviteeId,
	purposeOfMeeting,
	additionalNote,
	meetingDateAndTimeOne,
	meetingDateAndTimeTwo,
	proposedMeetingDuration,
}) => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_BACKEND_URL}/invite/create`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`,
					'x-custom-header':
						generateCustomHeader().responseType === 'success'
							? generateCustomHeader().responsePayload
							: '',
				},
				body: JSON.stringify({
					inviteeId: inviteeId || '',
					purposeOfMeeting: purposeOfMeeting || '',
					additionalNote: additionalNote || '',
					meetingDateAndTimeOne: meetingDateAndTimeOne || '',
					meetingDateAndTimeTwo: meetingDateAndTimeTwo || '',
					proposedMeetingDuration: proposedMeetingDuration || '',
				}),
			}
		);

		const data = await response.json();

		return data;
	} catch (error) {
		return {
			responseType: 'error',
			responseMessage:
				'Internal error. Please refresh the page. If the error persists, please contact the team',
			responseCode: 500,
			responseId: '87cB8F5URQsVUrHV',
			responseUniqueCode: 'webapp_error',
			responsePayload: null,
		};
	}
};

export default createInvite;
