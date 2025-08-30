export default {
	filter_spaces: (data=sel_spaces.data) => {
		let spaces_array = data;
		
		if (selection_space_category.selectedOptionValue !== 'All') {
			spaces_array = spaces_array.filter(s => s.category == selection_space_category.selectedOptionValue);
			return storeValue("space_category", selection_space_category.selectedOptionValue);
		} else {
			return storeValue("space_category", "All");
		}
		
	},

	
	
	get_space: async(data=sel_spaces.data) => {
		if (selection_space.selectedOptionValue == "None selected" && !!selection_space.selectedOptionValue) { 
			await storeValue("space_id", null, false);
			await storeValue("space_uuid", null, false);
			await storeValue("space_name", null, false);
			await storeValue("space_number", null, false);
			await storeValue("space_category", "All", false)
			return appsmith.store.space_category;
		}
		else { // if (selection_space.selectedOptionValue != 'None selected') {
			let spaces_array = data;
			spaces_array = spaces_array.filter(s => s.id === selection_space.selectedOptionValue);
			let space = spaces_array.slice().shift();

			await storeValue("space_id", space.id, false);
			await storeValue("space_uuid", space.uuid, false);
			await storeValue("space_name", space.name, false);
			await storeValue("space_number", space.number, false);
			await storeValue("space_category", space.category, false);
			return appsmith.store.space_category;
		}
		
	},
		
	
	
	upsert: async () => {
		// Store Reservation Static Details
		await storeValue("reservation_name", appsmith.store.keys_contacts.contact_uuid + '-' + appsmith.store.keys_contacts.key_uuid + '-' + appsmith.store.keys_contacts.visit_uuid + '-' + appsmith.store.space_uuid + '-' + appsmith.store.amount), false;
		await storeValue("status", "Reserved", false);
		const input_shift_date = moment().format("YYYY-MM-DDTHH:mm:ss");
		await storeValue("period", radioShiftSelected.selectedOptionValue ?? "1" ?? input_shift_date.formattedDate, false);
		
		await storeValue("time_period", await js_utils_datetime.getTimePeriod(), false);
		await storeValue("date", shiftDatePicker.formattedDate, false); // ?? appsmith.store.time_period.date ));
		await storeValue("day", appsmith.store.time_period.day, false);// ?? moment().format("dddd"));
		await storeValue("start", appsmith.store.time_period.start, false);
		await storeValue("end", appsmith.store.time_period.end, false);
		
		await storeValue("type_id", radioFormType.selectedOptionValue, false);
		await storeValue('type_uuid', radioFormType.selectedOptionValue ?? '{a6b98e54-ec6e-4317-805d-a0aebccfb60f}', false);
		
		await storeValue("user_profile_username", `usr${radioUserProfile.selectedOptionValue}`, false);
		await storeValue('user_profile_id', radioUserProfile.selectedOptionValue ?? '4', false);		
		await storeValue('user_profile_uuid', '{6a99dbe0-81ef-4335-8f49-9fe121ebd0e4}', false);
		const delay = (async ms => new Promise(res => setTimeout(res, ms)));
		
		if (!appsmith.store.photo_url_reservation) {storeValue("photo_url_reservation", appsmith.store.keys_contacts.contact_photo_url ?? "", false);}
		
		const reservation = {
			// Contact Details
			key_id: appsmith.store.keys_contacts.key_id,
			key_uuid: `{${appsmith.store.keys_contacts.key_uuid}}`,
			contact_id: appsmith.store.keys_contacts.contact_id,
			contact_uuid: `{${appsmith.store.keys_contacts.contact_uuid}}`,
			visit_id: appsmith.store.keys_contacts.visit_id,
			visit_uuid: `{${appsmith.store.keys_contacts.visit_uuid}}`,
			space_id: appsmith.store.space_id,
			space_uuid: `{${appsmith.store.space_uuid}}`,
			amount: appsmith.store.amount,
			
			// Transaction Details
			photo_url: `${appsmith.store.photo_url_reservation}`,
			name: appsmith.store.reservation_name,
			status: appsmith.store.status,
			period: appsmith.store.period,
			date: appsmith.store.date,
			day: appsmith.store.day,
			start: `'${appsmith.store.start}'`,
			end: `'${appsmith.store.end}'`,
			type_id: '1',
			type_uuid: '{a6b98e54-ec6e-4317-805d-a0aebccfb60f}',
			user_profile_id: appsmith.store.user_profile_id ?? '4',
			user_profile_uuid: '{6a99dbe0-81ef-4335-8f49-9fe121ebd0e4}',	
		}
	
		await storeValue("upsert_reservations", await upsert_reservations.run(reservation));
		
		if (!!appsmith.store.upsert_reservations) {
			showAlert("Reservation made successfully. Thank you!");
			await storeValue("on_success_reservation_form", true);
			
			await js_utils_input.remove_tbl();
			
			
			await delay(1000); // await (appsmith.store.auto_refresh && appsmith.store.reservations_enabled) ? await delay(1000) : "";
			await js_utils_reset.refresh_app(); // await (appsmith.store.auto_refresh && appsmith.store.reservations_enabled) ? js_utils_reset.refresh_app() : "";

			return true;
		} else { 
			showAlert("Reservation failed. Please retry.");
			await storeValue("on_success_reservation_form", false);

			await (appsmith.store.auto_refresh && appsmith.store.reservations_enabled) ? await delay(5000) : "";
			await (appsmith.store.auto_refresh && appsmith.store.reservations_enabled) ? js_utils_reset.refresh_app() : "";
			
			return false;
			
		}
	
	},
	
	get: async () => {
		const time_period = await js_utils_datetime.getTimePeriod();
		
		//const params = {
		//	'key_id': (!!appsmith.URL.queryParams.manual_entry) ? appsmith.URL.queryParams.key_id : appsmith.store.keys_contacts.key_id,
		//	'date': datepicker_period.selectedDate,
		//	'period': appsmith.store.period,
		//};
		
		//const resrv_data = await sel_reservations.run(params);
		
		let sb = new supabase.SupabaseClient(appsmith.store.supabaseUrl,appsmith.store.supabaseKey).from('reservations').select('*');

		if (!!appsmith.URL.queryParams.manual_entry) { sb = sb.eq('key_id', appsmith.URL.queryParams.key_id) }
		if (!appsmith.URL.queryParams.manual_entry && appsmith.store.keys_contacts.key_id) { sb = sb.eq('key_id', appsmith.store.keys_contacts.key_id) }
	  if (time_period.date)  { sb = sb.eq('date', time_period.date) }
		if (time_period.period) { sb = sb.eq('period', appsmith.store.period) }
		
		//const sb_data = await sb;
		//if (time_period.day)  { sb = sb.eq('day', time_period.day) }
	  //if (time_period.start) { sb = sb.eq('start', `'${time_period.start}'`) }
		//if (time_period.end) { sb = sb.eq('end', `'${time_period.end}'`) }
		
		return await sb;
	},
	
	// get_shift: async () => {
		// let sb = new supabase.SupabaseClient(appsmith.store.supabaseUrl,appsmith.store.supabaseKey).from('reservations').select('*');
// 
		// //if (!!data_table.selectedRow) { sb = sb.eq('key_id', keyfob ?? data_table.selectedRow.key_id) }
	  // if (true || !!appsmith.URL.queryParams.date)  { sb = sb.eq('date', shiftDatePicker.formattedDate) }
		// if (true || !!appsmith.URL.queryParams.period) { sb = sb.eq('period', RadioGroup1.selectedOptionValue) }
		// 
		// return await sb;
	// },	
	
}