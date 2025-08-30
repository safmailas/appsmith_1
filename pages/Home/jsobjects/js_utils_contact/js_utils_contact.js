export default {
	async upsert () {
		const param = {
			'contact_name': form_contact.formData.contact_name ?? form_contact.sourceData.contact_name,
			'contact_dob': form_contact.formData.contact_dob ?? form_contact.sourceData.contact_dob ?? moment().format("YYYY-MM-DD"),
			'contact_gender': form_contact.formData.contact_gender ?? form_contact.sourceData.contact_gender,
			'contact_phone': form_contact.formData.contact_phone ?? form_contact.sourceData.contact_phone,
			'contact_email': form_contact.formData.contact_email ?? form_contact.sourceData.contact_email,
			'contact_is_active': true ?? form_contact.formData.contact_is_active ?? form_contact.sourceData.contact_is_active,
			'contact_credits': form_contact.formData.contact_credits ?? "20",
			'contact_key_id': form_contact.sourceData.contact_key_id,
			'contact_last_modified': moment().format('YYYY-MM-DD HH:mm:ss.sssZ'),
			'contact_photo_url': (appsmith.store.upload_photo != null) ? `${appsmith.store.photo_url_prefix}${appsmith.store.upload_photo}` : form_contact.sourceData.contact_photo_url ?? (appsmith.URL.queryParams.manual_entry ) ? appsmith.store.keys_contacts.contact_photo_url ?? appsmith.store.photo_url : appsmith.store.photo,
			'contact_id': form_contact.formData.contact_id ?? form_contact.sourceData.contact_id,
			'contact_uuid': form_contact.formData.contact_uuid ?? form_contact.sourceData.contact_uuid,
		};
		
		const response = await upsert_contacts.run(param);
		await storeValue("update_contact_arr", response);
		await storeValue("update_contact", response.slice().shift() ?? appsmith.store.update_contact_dict);
		
		if ((typeof response != "undefined" && response != null && response.length != null && response.length > 0) || (!!upsert_contacts.responseMeta.isExecutionSuccess)) {
			await storeValue("on_success_contact_form", true);
			await showAlert("Contact updated successfully.");
			await storeValue("show_lbl_not_found", false);
			await storeValue("keys_contacts", { ...appsmith.store.keys_contacts_dict, ...appsmith.store.keys_contacts, ...upsert_contacts.data.slice().shift() });
			
			if (appsmith.store.auto_refresh && !appsmith.store.show_reservations) { await js_utils_reset.refresh_app(); };
	
		} else {
			await storeValue("on_success_contact_form", false);
			await showAlert("Contact update failed.");
			await (!!appsmith.store.keys_contacts.contact_key_id) ? storeValue("show_lbl_not_found", false) : storeValue("show_lbl_not_found", true);

		}

		return(upsert_contacts.data);
	}
}