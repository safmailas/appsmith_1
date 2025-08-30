export default {
	async remove_row () {
		const response = inputArrayTable.selectedRow ? await inputArrayTable.tableData.splice(inputArrayTable.tableData.findIndex(row => row.value === inputArrayTable.selectedRow.value), 1) : false;
		return response;
	},

	async handle_tbl () {
		const scan = await js_utils_rfid.store_rfid(input_key_rfid.text ?? appsmith.URL.queryParams.key_id, checkbox_scan_keys.isChecked ? "upsert" : "select");
		const lookup_type = checkbox_scan_keys.isChecked ? "upsert" : "select";
		
		if (!!scan ) {
			await (lookup_type == "upsert" ? upsert_keys_contacts_visits : sel_keys_contacts_ins_visits).run({"key": scan});
			await lookup_type == "upsert" ? storeValue("keys_contacts", {...appsmith.store.keys_contacts_dict,...upsert_keys_contacts_visits.data.slice().shift() }, false) : storeValue("keys_contacts", {...appsmith.store.keys_contacts_dict,...sel_keys_contacts_ins_visits.data.slice().shift() }, false);
			
			const reservations_dict = {
				"key_id": null,
				"key_uuid": null,
				"contact_id": null,
				"contact_uuid": null,
				"visit_id": null,
				"visit_uuid": null,
				"photo_url": null,
				"name": null,
				"status": null,
				"amount": null,
				"period": null,
				"date": null,
				"day": null,
				"start": null,
				"end": null,
				"space_id": null,
				"space_uuid": null,
				"type_id": null,
				"type_uuid": null,
				"user_profile_id": null,
				"user_profile_uuid": null,
			};
			
			await sel_existing_reservations.run();
			const store_reservations = (typeof sel_existing_reservations.data != "undefined" && sel_existing_reservations.data != null && sel_existing_reservations.data.length != null && sel_existing_reservations.data.length > 0) ? sel_existing_reservations.data.slice() : [reservations_dict];
			await storeValue("store_reservations", store_reservations, false);

			let currentData = {};
			currentData.photo = appsmith.store.keys_contacts.contact_photo_url;
			currentData.id = appsmith.store.keys_contacts.contact_id;
			currentData.scan = appsmith.store.keys_contacts.contact_key_id;
			currentData.name = appsmith.store.keys_contacts.contact_name;
			currentData.last = appsmith.store.keys_contacts.contact_last_modified;
			currentData.reserve = appsmith.store.store_reservations.date;
			//currentData.last_reserved = store_reservations.created_at;

			await inputArrayTable.setData([ currentData, ...inputArrayTable.tableData ]);
			console.log(inputArrayTable);
			return true;
		} else { return false; }
	},

	async remove_tbl () {
		if (inputArrayTable.selectedRow) {
			await inputArrayTable.tableData.splice(inputArrayTable.tableData.findIndex(row => row.value === inputArrayTable.selectedRow.value), 1);
		}
	},

	async lookup_reservations (responseData=appsmith.store.keys_contacts) {
		return await js_utils_rfid.check_reservations(js_utils_rfid.lookup_reservations({"key_id": responseData.key_id}) );
	},
	// async i () {
		// let response = await js_utils_input.ii();
		// return !!response ? response : false;
	// },
// 
	// async ii () {
		// await storeValue('ii', 'Hello World', false);
		// return !!appsmith.store.ii ? appsmith.store.ii : false;
	// },
}