export default {
	get: async (keyfob, datepicker_from, datepicker_to) => {
		if (appsmith.store.demo_mode || !appsmith.store.supabaseUrl || !appsmith.store.supabaseKey) {
			return [];
		}
		let sb = new supabase.SupabaseClient(appsmith.store.supabaseUrl,appsmith.store.supabaseKey).from('reservations').select('*');

		if (!!data_table.selectedRow) { sb = sb.eq('key_id', keyfob ?? data_table.selectedRow.key_id) }
	  if (!!appsmith.URL.queryParams.date)  { sb = sb.eq('date', appsmith.URL.queryParams.date) }
		//if (!!appsmith.URL.queryParams.period) { sb = sb.eq('period', appsmith.URL.queryParams.period) }
		
		return await sb;
	},
}