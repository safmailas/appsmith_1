export default {
	get: async () => {
		const time_period = await js_utils_datetime.getTimePeriod();

		let sb = new supabase.SupabaseClient(appsmith.store.supabaseUrl,appsmith.store.supabaseKey).from('reservations').select('*');

		if (appsmith.store.keys_contacts.contact_uuid) { sb = sb.eq('contact_uuid', appsmith.store.keys_contacts.contact_uuid) }
		if (time_period.date)  { sb = sb.eq('date', time_period.date) }
		if (appsmith.store.period) { sb = sb.eq('period', appsmith.store.period) }
		return await sb;
	},
}
//		if (time_period.day)  { sb = sb.eq('day', time_period.day) }
//	  if (time_period.start) { sb = sb.eq('start', `'${time_period.start}'`) }
//		if (time_period.end) { sb = sb.eq('end', `'${time_period.end}'`) }


// if (filterByKey) { sb = sb.ilike('key_uuid', `{${filterByKey}}`) }
// if (filterByVisit) { sb = sb.ilike('visit_uuid', `{${filterByVisit}}`) }

// const rsp = await sb; // { data, error } = await query
// return rsp;	
// check: async () => {
// const time_period = await js_utils_datetime.getTimePeriod();
// let sb = new supabase.SupabaseClient(appsmith.store.supabaseUrl,appsmith.store.supabaseKey);
// 
// const rsp = await sb.from('reservations').select('*')
// .ilike('contact_uuid', `{${appsmith.store.keys_contacts.contact_uuid}}`)
// .ilike('key_uuid', `{${appsmith.store.keys_contacts.key_uuid}}`)
// .ilike('date', `%${time_period.date}%`)
// .ilike('day', `%${time_period.day}%`)
// .ilike('start', `%${time_period.start}%`)
// .ilike('end', `%${time_period.end}%`)
// 
// 
// return rsp;
// },



// Function to check if a record was created within a predefined time period
// isRecordCreatedWithin (records, timePeriodInHours) {
// const currentTime = new Date(); // Get the current time
// 
// // Calculate the time threshold
// const timeThreshold = new Date();
// timeThreshold.setHours(currentTime.getHours() - timePeriodInHours);
// 
// console.log(timeThreshold.setHours(currentTime.getHours() - timePeriodInHours));
// 
// // Check if any record's createdAt is after the time threshold
// for (const record of records) {
// if (record.createdAt > timeThreshold) {
// return true; // Record created within the predefined time period
// }
// }
// 
// return false; // No record found within the predefined time period
// },


// // Usage
// time_periods () {
// // Example data
// const timePeriods = {
// Monday: [
// { start: "08:00", end: "15:59" },
// { start: "16:00", end: "03:59" }
// ],
// Tuesday: [
// { start: "08:00", end: "15:59" },
// { start: "16:00", end: "03:59" }
// ],
// Wednesday: [
// { start: "08:00", end: "15:59" },
// { start: "16:00", end: "03:59" }
// ],
// Thursday: [
// { start: "08:00", end: "15:59" },
// { start: "16:00", end: "03:59" }
// ],
// Friday: [
// { start: "08:00", end: "13:59" },
// { start: "14:00", end: "23:59" }
// ],
// Saturday: [
// { start: "00:00", end: "07:59" },
// { start: "08:00", end: "13:59" },
// { start: "14:00", end: "23:59" }
// ],
// Sunday: [
// { start: "00:00", end: "07:59" },
// { start: "08:00", end: "13:59" },
// { start: "14:00", end: "23:59" }
// ]
// };
// 
// const records = [
// { id: 1, createdAt: new Date("2023-05-05T10:00:00") },
// { id: 2, createdAt: new Date("2023-05-07T08:30:00") },
// { id: 3, createdAt: new Date("2023-05-09T15:45:00") },
// ];
// const timePeriodInHours = 24;
// const recordCreatedWithinTimePeriod = js_utils_credits.isRecordCreatedWithin(records, timePeriodInHours);
// 
// console.log(recordCreatedWithinTimePeriod);
// },

// }