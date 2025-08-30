export default {
	handle_visitor: async (rfid_get=appsmith.store.rfid, type="select") => {
		const rfid = await js_utils_rfid.store_rfid(rfid_get, type)
		.then(async () => { return js_utils_rfid.store_rfid(rfid, type);})
		.then(async () => { return js_utils_rfid.reset();})
		.then(async () => { return js_utils_rfid.lookup_visitor(rfid, type);})
		.then(async () => {	return js_utils_rfid.store_visitor(type);})
		.then(async function (store_visitor) { return js_utils_rfid.lookup_reservations(store_visitor);})
		.then(async (lookup_reservations) => { return js_utils_rfid.check_reservations(lookup_reservations);})
		.then(async (check_reservations) => { return js_utils_rfid.alert_reservations(check_reservations);})		
		.catch(async () => { await showAlert(`Failure: Cannot find Keyfob ${rfid}.`); await storeValue("show_lbl_found", true, false); return false;})

		storeValue("handle", await rfid, false);
		console.log(appsmith.store.handle);
		return await rfid;
	},
	
	store_rfid: async (rfid_get=appsmith.store.rfid) => {
		const rfid_input = !!input_key_rfid.text ? await js_utils_rfid.hexToDecimal(input_key_rfid.text) : null;
		const rfid = rfid_input ?? rfid_get;
		await storeValue("rfid", rfid_input ?? rfid_get, false);
		return rfid;
	},
	
	lookup_key: async (rfid=js_utils_rfid.store_rfid()) => {
		return await sel_key.run({'key_id': rfid});
	},
	
	reset: async() => {
		await js_utils_reset.reset_store(['keys_contacts', 'key_contact_visit', 'sel_keys_contacts_ins_visits', 'insert_keys_contacts_visits', 'upsert_keys_contacts_visits']);
		await storeValue("on_success_contact_form", false, false);
		await storeValue("is_pin_locked", (appsmith.store.pin == appsmith.store.input_pin) ? false : true, false);
		await resetWidget("form_contact", false);
		await storeValue("show_lbl_not_found", false, false);
		return true;
	},
	
	lookup_visitor: async (rfid, type="select") => {
		return await (type == "upsert" ? upsert_keys_contacts_visits : sel_keys_contacts_ins_visits).run({"key": rfid});
	},
	
	store_visitor: async (type="select") => {
		// storeValue("keys_contacts", { ...appsmith.store.keys_contacts_dict, lookup_visitor.data.slice().shift() }, false);
		// await (type == "upsert" ? upsert_keys_contacts_visits : sel_keys_contacts_ins_visits).run({"key": rfid})
		await type == "upsert" ? storeValue("keys_contacts", {...appsmith.store.keys_contacts_dict,...upsert_keys_contacts_visits.data.slice().shift() }, false) : storeValue("keys_contacts", {...appsmith.store.keys_contacts_dict,...sel_keys_contacts_ins_visits.data.slice().shift() }, false);
		return appsmith.store.keys_contacts;
	},
	
	lookup_reservations: async (store_visitor=appsmith.store.keys_contacts.key_id) => {
		return await sel_existing_reservations.run({"key_id": store_visitor});
	},
	
	store_reservations: async (key_id) => {
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
		const store_reservations = {...reservations_dict };
		
		const lookup_reservations = await sel_existing_reservations.run();
		if (typeof lookup_reservations != "undefined" && lookup_reservations != null && lookup_reservations.length != null && lookup_reservations.length > 0) { 
			const store_reservations = {...reservations_dict, ...lookup_reservations.data.slice().shift() };
		}
		await storeValue("store_reservations", store_reservations, false);
		return appsmith.store.store_reservations;
	},
	
	check_reservations: async (lookup_reservations=sel_existing_reservations.data) => {
		return !(typeof lookup_reservations != "undefined" && lookup_reservations != null && lookup_reservations.length != null && lookup_reservations.length > 0);
	},
	
	alert_reservations: async (check_reservations) => {
		if (!check_reservations) { // (typeof lookup_reservations != "undefined" && lookup_reservations != null && lookup_reservations.length != null && lookup_reservations.length > 0) {
			await showAlert(`Stop: Keyfob was reserved earlier in today's shift.`);
			await storeValue("claim_exists", true, false);
			await storeValue("show_reservations", false, false);
			return false;
		} else {
			await storeValue("claim_exists", false, false);
			await storeValue("show_lbl_found", true, false);
			await storeValue("show_reservations", true, false);
			return true;
		}
	},
	
	hexToDecimal: async (hex) => {
		if (!!hex) {
			hex = hex.replace(/^0x/, ''); // Remove any leading "0x" if present
			hex = hex.toUpperCase(); // Convert hex digits to uppercase
			const hexDigits = '0123456789ABCDEF';
			let decimal = 0;

			for (let i = 0; i < hex.length; i++) {
				const digit = hex[i];
				const value = hexDigits.indexOf(digit);
				decimal += value * Math.pow(16, hex.length - i - 1);
			}		
			return decimal;
		} else { return null; }
	},	
	
	get: async (rfid_get=appsmith.store.rfid, type="select") => {
		const rfid = await js_utils_rfid.store_rfid(rfid_get);
		await js_utils_rfid.reset();
		
		return (
			async function() {
			await ((type == "upsert") ? upsert_keys_contacts_visits : sel_keys_contacts_ins_visits).run( {"key": rfid} )
				.then(async () => await ((type == "upsert") ? 
																 storeValue("keys_contacts", { ...appsmith.store.keys_contacts_dict,...upsert_keys_contacts_visits.data.slice().shift() }, false) :
																 storeValue("keys_contacts", { ...appsmith.store.keys_contacts_dict, ...sel_keys_contacts_ins_visits.data.slice().shift() }, false)) )
				.catch(async () => {await showAlert(`Error: Contact for Keyfob ${rfid} not matched.`); await storeValue("show_lbl_found", true, false); });

			if (!!appsmith.store.keys_contacts.contact_key_id) {
				await showAlert(`Welcome: Keyfob ${rfid} found.`);
				if (!!appsmith.store.keys_contacts.contact_photo_url) {
					await storeValue("show_widget_camera", false, false);
				}
				await storeValue("show_lbl_found", false, false);
				
				const response = await sel_existing_reservations.run({'key_id': rfid});
				
				if (typeof response != "undefined" && response != null && response.length != null && response.length > 0) { //if (!Array.isArray(sel_existing_reservations.data) || !sel_existing_reservations.data.length) {
					await showAlert(`A claim for contact with keyfob ${rfid} for the current time period already exists.`);
					await storeValue("claim_exists", true, false);
					await storeValue("show_reservations", false, false);
				} else {
					await storeValue("claim_exists", false, false);
					await storeValue("show_reservations", true, false);
				}
			} else {
				await showAlert(`Error: Contact for Keyfob ${rfid} not matched.`);
				await storeValue("claim_exists", false, false);
				await storeValue("show_lbl_found", true, false);
				await storeValue("show_reservations", false, false);
			}

			if (appsmith.store.auto_refresh && !appsmith.store.show_reservations) {
				let delay = (async ms => new Promise(res => setTimeout(res, ms)));
				await delay(1000);
				await js_utils_reset.refresh_app();
			} else {
				const retrieve_response = await storeValue("photo_url", await js_utils_image.retrieve(appsmith.store.keys_contacts.contact_uuid), false);
				return (retrieve_response);
			}
		}
		);
	},
}