export default {
	reset_store: async(resetValues) => {
		// Definitions

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
		
		const keys_contacts_dict = {
			'contact_key_id': null,
			'contact_name': null,
			'contact_photo_url': null,
			'contact_dob': null,
			'contact_gender': null,
			'contact_credits': null,
			'contact_phone': null,
			'contact_email': null,
			'contact_is_active': null,
			'contact_uuid': null,
			'contact_id': null,
			'contact_last_modified': null,
			'contact_created_at': null,
			'key_notes': null,
			'key_is_active': null,
			'key_uuid': null,
			'key_id': null,
			'key_last_modified': null,
			'key_created_at': null,
			'visit_contact_uuid': null,
			'visit_contact_id': null,
			'visit_key_id': null,
			'visit_uuid': null,
			'visit_id': null,
			'visit_last_modified': null,
			'visit_created_at': null,
		};
		
		const spaces_dict = {
			id: null,
			uuid: null,
			name: null,
			number: null,
			category: null,
		};
		
		const spaces_array = spaces_dict;

		const space_groups = [
			{ "label": "All", "value": "All"},
			{ "label": "FIRELINK", "value": "FIRELINK"},
			{ "label": "KENO", "value": "KENO"},
			{ "label": "LOL", "value": "LOL"},
			{ "label": "POG", "value": "POG"},
		]; //{{ [{ "label": "All", "value": "All"}, ...[...new Set(sel_spaces.data.slice().map(record=>record.category))].map(sel => (	{ "label": sel, "value": sel } ))] }}

		const user_profiles = [
			{'username': 'usr1001', 'password': '5676'},
			{'username': 'usr2001', 'password': '5668'},
			{'username': 'usr9001', 'password': '9956'},];

		const time_period = {
			date: null,
			period: null,
			day: null,
			start: null,
			end: null,
		}

		const time_periods = {
			Monday: [
				{ start: "08:00", end: "15:59" },
				{ start: "16:00", end: "03:59" }
			],
			Tuesday: [
				{ start: "08:00", end: "15:59" },
				{ start: "16:00", end: "03:59" }
			],
			Wednesday: [
				{ start: "08:00", end: "15:59" },
				{ start: "16:00", end: "03:59" }
			],
			Thursday: [
				{ start: "08:00", end: "15:59" },
				{ start: "16:00", end: "03:59" }
			],
			Friday: [
				{ start: "08:00", end: "13:59" },
				{ start: "14:00", end: "23:59" }
			],
			Saturday: [
				{ start: "00:00", end: "07:59" },
				{ start: "08:00", end: "13:59" },
				{ start: "14:00", end: "23:59" }
			],
			Sunday: [
				{ start: "00:00", end: "07:59" },
				{ start: "08:00", end: "13:59" },
				{ start: "14:00", end: "23:59" }
			]
		};

		const key_contact_visit_dict = keys_contacts_dict;
		const update_contact_dict = keys_contacts_dict;
		const photo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='91' height='91'%3E%3Cpath d='M 37.689 36.621 c -10.097 0 -18.311 -8.214 -18.311 -18.311 S 27.592 0 37.689 0 C 47.786 0 56 8.214 56 18.311 S 47.786 36.621 37.689 36.621 z'/%3E%3Cpath d='M 77.215 58.707 h -6.429 c -0.867 0 -1.572 -0.705 -1.572 -1.572 V 56.79 c 0 -1.854 -1.508 -3.361 -3.361 -3.361 H 52.332 c -1.854 0 -3.361 1.508 -3.361 3.361 v 0.345 c 0 0.867 -0.705 1.572 -1.572 1.572 H 40.97 c -2.536 0 -4.599 2.063 -4.599 4.6 V 85.4 c 0 2.536 2.063 4.6 4.599 4.6 h 36.245 c 2.536 0 4.599 -2.063 4.599 -4.6 V 63.307 C 81.813 60.771 79.751 58.707 77.215 58.707 z'/%3E%3Cpath d='M 30.371 85.4 V 63.307 c 0 -5.845 4.755 -10.6 10.599 -10.6 h 2.939 c 1.52 -3.122 4.724 -5.278 8.423 -5.278 h 8.943 c -2.719 -3.657 -6.242 -6.683 -10.382 -8.772 c -0.313 -0.158 -0.689 -0.14 -0.987 0.049 c -3.669 2.338 -7.894 3.575 -12.216 3.575 s -8.547 -1.236 -12.215 -3.575 c -0.298 -0.19 -0.673 -0.208 -0.988 -0.049 C 14.432 43.729 8.186 53.828 8.186 65.013 v 20.395 c 0 2.532 2.061 4.593 4.593 4.593 h 18.657 C 30.76 88.606 30.371 87.05 30.371 85.4 z'/%3E%3Cpath d='M 73.412 68.943 c -1.378 0 -2.5 -1.122 -2.5 -2.5 c 0 -1.379 1.122 -2.5 2.5 -2.5 c 1.379 0 2.5 1.122 2.5 2.5 C 75.913 67.821 74.791 68.943 73.412 68.943 z'/%3E%3Cpath d='M 59.092 68.062 c -3.726 0 -6.756 3.031 -6.756 6.757 c 0 1.103 0.897 2 2 2 s 2 -0.897 2 -2 c 0 -1.521 1.236 -2.757 2.756 -2.757 c 1.103 0 2 -0.897 2 -2 S 60.194 68.062 59.092 68.062 z'/%3E%3Ccircle cx='59.096' cy='74.816' r='10.336' stroke='white' stroke-width='1' /%3E%3C/svg%3E";

		const reset_store_static = {
			'supabaseUrl':'https://krgydosqxgwuxphfwybp.supabase.co', 
			'supabaseKey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZ3lkb3NxeGd3dXhwaGZ3eWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIzNjM5MTYsImV4cCI6MTk5NzkzOTkxNn0.fZ242ifnSjydD8NZ7IwnLEH7ghaMSfR-DILwADa9yYM',
			'resetCounter': 0,
			'auto_refresh': false,
			'refresh_now': false,

			'originalDict': keys_contacts_dict,
			'responseDict': keys_contacts_dict,
			'keys_contacts_dict': keys_contacts_dict, 
			'key_contact_visit_dict': keys_contacts_dict,
			'sel_keys_contacts_ins_visits_dict': keys_contacts_dict,
			'insert_keys_contacts_visits_dict': keys_contacts_dict,
			'upsert_keys_contacts_visits_dict': keys_contacts_dict,
			'update_contact_dict': keys_contacts_dict,
			'reservations_dict': reservations_dict,
			
			'user_profiles': user_profiles,
			'list_visibility': false,
			'claim_exists': false,

			'amount': "0",
			"space_category": "All",			
			'time_periods': time_periods,
			'time_period': time_period,
			'reservations_enabled': true,
			'show_reservations': false,
			"status": "Pending",
			"period": "1",
			"day": moment().format("dddd"),

			"spaces_dict": spaces_dict,
			"spaces_array" : spaces_array,
			"space_id": null,
			"space_uuid": null,
			"space_name": null,
			"space_number": null,
			
			"type_id": "1",
			"type_uuid": "a6b98e54-ec6e-4317-805d-a0aebccfb60f",
			"user_profile_id": "4",
			"user_profile_uuid": "6a99dbe0-81ef-4335-8f49-9fe121ebd0e4",		

			'contact_is_vip': null,
			'on_success_contact_form': false,
			'user_access_status': true, // null, // {{!!appsmith.store.user_profiles.filter(row => row.username == input_user_profile.inputText && row.password == input_user_profile_password.inputText)}}
			'is_pin_locked': true,

			'show_widget_camera': true,
			'upload_response': null,
			'upload_photo': null,
			'file_name': null,
			'file_path': null,
			'retrieve_response': {'name': null},
			'photo_blob': null,
			'photo': photo,
			'photo_default': photo,
			'photo_url': null,

			'show_camera_reservation': true,
			'upload_response_reservation': null,			
			'upload_photo_reservation': null,
			'file_name_reservation': null,
			'photo_reservation': photo,
			'photo_blob_reservation': null,
			'photo_url_reservation': null,
			'retrieve_response_reservation': {'name': null},
			'rfid': null,

			'pin': '080622',
			'photo_url_prefix': 'https://krgydosqxgwuxphfwybp.supabase.co/storage/v1/object/public/images/',
			'photo_url_reservations_prefix': 'https://krgydosqxgwuxphfwybp.supabase.co/storage/v1/object/public/images/posts/',
			'photo_url_contacts_prefix': 'https://krgydosqxgwuxphfwybp.supabase.co/storage/v1/object/public/images/avatars/',
		};

		const reset_store_dynamic = {
			// APP-SPECIFIC
			'input_pin': null,
			'app_is_refreshed': true,
			'show_lbl_not_found': false,
			'claim_exists': false,

			// KEY_CONTACT_VISIT_DICT
			'key_contact_visit': keys_contacts_dict,
			'key_contact_visit_arr': [keys_contacts_dict],

			'sel_keys_contacts_ins_visits': keys_contacts_dict,
			'sel_keys_contacts_ins_visits_rfid': [keys_contacts_dict],

			'insert_keys_contacts_visits': keys_contacts_dict,
			'insert_keys_contacts_visits_rfid': [keys_contacts_dict],

			'upsert_keys_contacts_visits': keys_contacts_dict,
			'upsert_keys_contacts_visits_rfid': [keys_contacts_dict],

			// KEYS_CONTACTS_DICT			
			'keys_contacts': keys_contacts_dict,
			'keys_contacts_rfid': [keys_contacts_dict],

			// UPDATE_CONTACT_DICT
			'update_contact': keys_contacts_dict,
			'update_contact_arr': [keys_contacts_dict],

			// ORIGINAL
			'response_dict': keys_contacts_dict,
			'response_array': [keys_contacts_dict],
		};


		if (resetValues === undefined) 
		{for (const once in reset_store_static)
		{storeValue(once, reset_store_static[once], false);};}
		else
		{for (const r of resetValues)
		{storeValue(r, reset_store_dynamic[r], false);};}


		return(appsmith.store);
	},



	reset_on_load: async() => {
		if ( !!appsmith.URL.queryParams.manual_entry ) {
			await js_utils_rfid.get(appsmith.URL.queryParams.key_id, checkbox_scan_keys.isChecked ? "upsert" : "select");
			//const shift_last_selected = appsmith.store.shift_last_selected;
		} else {
		
		await clearStore();
		await js_utils_reset.reset_widgets();

		await js_utils_reset.reset_store([
			// APP-SPECIFIC
			'input_pin',
			'app_is_refreshed',
			'show_lbl_not_found',

			// SPACES_DICT
			'spaces_dict',
			'spaces_array',

			// KEY_CONTACT_VISIT_DICT
			'key_contact_visit',
			'key_contact_visit_arr',

			'sel_keys_contacts_ins_visits', 
			'sel_keys_contacts_ins_visits_rfid',

			'insert_keys_contacts_visits',
			'insert_keys_contacts_visits_rfid', 

			'upsert_keys_contacts_visits', 
			'upsert_keys_contacts_visits_rfid',

			// KEYS_CONTACTS_DICT
			'keys_contacts', 
			'keys_contacts_rfid',

			// UPDATE_CONTACT_DICT
			'update_contact',
			'update_contact_arr',		

			// ORIGINAL
			'response_dict',
			'response_array',
		]);

		await js_utils_reset.reset_store();
		await resetWidget("form_contact", false);
		//await resetWidget("input_pin", false);

		await storeValue('claim_exists', false);
//		await js_utils_delete_photos.delete_photos();
		await sel_visits_reservations.run();
		// await js_utils_input.on_load();
			
		}
		return(appsmith.store);
	},	

	refresh_app: async() => {
		await storeValue("rfid", null, false);
		await storeValue("refresh_now", true);

		js_utils_reset.reset_store([
			// KEY_CONTACT_VISIT_DICT
			'key_contact_visit',
			'key_contact_visit_arr',
			'sel_keys_contacts_ins_visits', 
			'sel_keys_contacts_ins_visits_rfid',
			'insert_keys_contacts_visits',
			'insert_keys_contacts_visits_rfid', 
			'upsert_keys_contacts_visits', 
			'upsert_keys_contacts_visits_rfid',
			// KEYS_CONTACTS_DICT			
			'keys_contacts', 
			'keys_contacts_rfid',
			// UPDATE_CONTACT_DICT
			'update_contact',
			'update_contact_arr',
			// ORIGINAL
			'response_dict',
			'response_array',
			// APP-SPECIFIC
			'show_lbl_found',
			'spaces_dict',
			'spaces_array',
			'claim_exists',
		]);

		storeValue('show_lbl_found', false);
		storeValue('contact_is_vip', null);
		storeValue('claim_exists', false);

		const time_period = {
			date: null,
			period: null,
			day: null,
			start: null,
			end: null,
		}
		storeValue('time_period', time_period);
		storeValue('amount', "0");
		
		storeValue('space_id', null, false);
		storeValue('space_category', "All", false);
		storeValue("space_uuid", null, false);
		storeValue("space_name", null, false);
		storeValue("space_number", null, false);

		storeValue('claim_exists', false);

		storeValue('reservations_enabled', true);
		storeValue('show_reservations', false);
		storeValue('status', "Pending");
		storeValue('period', radioShiftSelected.selectedOptionValue);
		storeValue('date', null);
		storeValue('day', moment().format("dddd"));
		storeValue('start', null);
		storeValue('end', null);

		storeValue('show_widget_camera', true);		
		storeValue('photo', appsmith.store.photo_default);
		storeValue('photo_blob', null);
		storeValue('upload_response', null);
		storeValue('upload_photo', null);	
		storeValue('photo_url', null);
		storeValue('retrieve_response', {'name': null});

		storeValue('show_camera_reservation', true);
		storeValue('photo_reservation', appsmith.store.photo_default);
		storeValue('photo_url_reservation', null);
		storeValue('photo_blob_reservation', null);
		storeValue('upload_response_reservation', null);
		storeValue('upload_photo_reservation', null);
		storeValue('retrieve_response_reservation', {'name': null});
		//resetWidget("camera_reservation_photo", false);
		//resetWidget("image_reservation_photo", false);		

		resetWidget("input_key_rfid");
		resetWidget("form_contact");
		resetWidget("camera_contact_photo_url");
		resetWidget("image_contact_photo_url");

		storeValue("resetCounter", appsmith.store.resetCounter + 1);
		storeValue("app_is_refreshed", true);
		//resetWidget("switch_auto_refresh");

		resetWidget("input_key_rfid");
		resetWidget("datepicker_period");
		resetWidget("selection_space_category");
		resetWidget("selection_space");
		//resetWidget("select_amount");
		resetWidget("btns_amount");
		resetWidget("radioFormType");
		await sel_visits_reservations.run();
		
		// await js_utils_input.on_load();
		
		await storeValue("refresh_now", false);
		return (appsmith.store.app_is_refreshed);
	},

	reset_widgets: async() => {
		await storeValue('contact_is_vip', null);
		await storeValue('show_widget_camera', true);
		await storeValue('photo', appsmith.store.photo_default);
		await storeValue('photo_blob', null);
		await storeValue('upload_response', null);
		await storeValue('upload_photo', null);	
		await storeValue('retrieve_response', {'name': null});
		await resetWidget("camera_contact_photo_url", false);
		await resetWidget("image_contact_photo_url", false);

		await resetWidget("input_key_rfid", false);
		await resetWidget("form_contact", false);
		//await resetWidget("switch_auto_refresh", false);
		//if (appsmith.store.input_pin != appsmith.store.pin) {resetWidget("input_pin", false)};
		await storeValue('show_camera_reservation', true);
		await storeValue('photo_reservation', appsmith.store.photo_default);
		await storeValue('photo_blob_reservation', null);
		await storeValue('upload_response_reservation', null);
		await storeValue('upload_photo_reservation', null);		
		await storeValue('retrieve_response_reservation', {'name': null});
		//await resetWidget("camera_reservation_photo", false);
		//await resetWidget("image_reservation_photo", false);

		await resetWidget("datepicker_period");
		await resetWidget("selection_space_category");
		await resetWidget("selection_space");
		//resetWidget("select_amount");
		await resetWidget("btns_amount");
		await resetWidget("radioFormType");
		

		return(true);
	},
}