export default {
	photo_url_contacts_prefix: appsmith.store.photo_url_contacts_prefix ?? `https://placehold.co/91x91?text=Avatar`,
	
	upload: async(base64String, fileName) => {
		const filePath = `${fileName}.png`;
		console.log(`File Path: ${filePath}`);
		console.log(`Base64String: ${base64String}`);
		
		await storeValue("file_name", fileName);
		await storeValue('show_widget_camera', false);
		await storeValue('photo_blob', camera_contact_photo_url.imageBlobURL);
		
		// Convert base-64 string to Blob object
		const blob = await fetch(base64String).then(res => res.blob())
		// Create File object from Blob
		const file = new File([blob], filePath, { type: blob.type })
		// Demo-mode: short-circuit without network
		if (appsmith.store.demo_mode || !appsmith.store.supabaseUrl || !appsmith.store.supabaseKey) {
			await storeValue("upload_photo", `avatars/${filePath}`);
			await removeValue("photo");
			await resetWidget("image_contact_photo_url");
			await storeValue("photo_url", appsmith.store.photo_default);
			await js_utils_contact.upsert();
			return appsmith.store.photo_url;
		}

		// Upload file to Supabase storage bucket
		const supabaseUrl = appsmith.store.supabaseUrl;
		const supabaseKey = appsmith.store.supabaseKey;
		
		let upload_response = await new supabase.SupabaseClient(supabaseUrl, supabaseKey)
			.storage
			.from('images')
			.upload('avatars/'+filePath, file, {
    		contentType: 'image/png',
				cacheControl: 'no-store',
				upsert: true
			})
		
		// Handle upload response
		if (upload_response.error) {
			console.log(await upload_response.error);
			await showAlert("Photo upload failed. Please retry.");
			return false;
		} else {
			await storeValue("upload_photo", await upload_response.data.path);
			await removeValue("photo");
			await resetWidget("image_contact_photo_url");
			
			await storeValue("photo_url", await js_utils_image.retrieve(fileName));
			await js_utils_contact.upsert();
			
			return appsmith.store.photo_url;
//			await storeValue("photo", await js_utils_image.retrieve.run(()=>{download(js_utils_image.retrieve.data)}));
		}
	},
	
	upload_reservation: async(base64String, fileName) => {
		const filePath = `${fileName}.png`;
		console.log(`File Path: ${filePath}`);
		console.log(`Base64String: ${base64String}`);
		const camera_reservation_photo = appsmith.store.photo_url_reservation ?? appsmith.store.photo_url;
		if (appsmith.store.demo_mode || !appsmith.store.supabaseUrl || !appsmith.store.supabaseKey) {
			await storeValue("upload_photo_reservation", `posts/${filePath}`);
			await removeValue("photo_reservation");
			await resetWidget("image_reservation_photo");
			await storeValue("photo_url_reservation", appsmith.store.photo_default);
			return appsmith.store.upload_photo_reservation;
		}
		const supabaseUrl = appsmith.store.supabaseUrl;
		const supabaseKey = appsmith.store.supabaseKey;
		
		await storeValue("file_name_reservation", fileName);
		await storeValue('show_camera_reservation', false);
		await storeValue('photo_blob_reservation', camera_reservation_photo.imageBlobURL);
		
		// Convert base-64 string to Blob object
		const blob = await fetch(base64String).then(res => res.blob())
		// Create File object from Blob
		const file = new File([blob], filePath, { type: blob.type })
		// Upload file to Supabase storage bucket
		let upload_response = await new supabase.SupabaseClient(supabaseUrl, supabaseKey)
			.storage
			.from('images')
			.upload('posts/'+filePath, file, {
    		contentType: 'image/png',
				cacheControl: 'no-store',
				upsert: true
			})
		
		// Handle upload response
		if (upload_response.error) {
			console.log(await upload_response.error);
			await showAlert("Photo upload failed. Please retry.");
			return false;
		} else {
			await storeValue("upload_photo_reservation", await upload_response.data.path);
			await removeValue("photo_reservation");
			await resetWidget("image_reservation_photo");
			await storeValue("photo_url_reservation", await js_utils_image.retrieve_reservation(fileName));
			
			return appsmith.store.upload_photo_reservation;
		}

	},
	
		retrieve_reservation: async(fileName) => {
			if (appsmith.store.demo_mode || !appsmith.store.supabaseUrl || !appsmith.store.supabaseKey) {
				await storeValue("photo_reservation", appsmith.store.photo_default, false);
				return appsmith.store.photo_reservation;
			}
			const supabaseUrl = appsmith.store.supabaseUrl;
			const supabaseKey = appsmith.store.supabaseKey;
		fileName = fileName ?? appsmith.store.keys_contacts.visit_uuid;
		let retrieve_response = new supabase.SupabaseClient(supabaseUrl,supabaseKey);
		let photo = null;
		if (!!fileName) {
			const filePath = `${fileName}.png` ?? `${appsmith.store.keys_contacts.visit_uuid}.png`;
			const rsp = await retrieve_response.storage.from('images/posts').getPublicUrl(filePath); 
			await storeValue("retrieve_response_reservation", { 'name': rsp.data.publicUrl }, false); // null,  ...rsp.data.slice().shift()}); // ?? rsp2.data.slice().shift())});  // ...rsp.data.slice().shift()});
			photo = await rsp.data.publicUrl ?? appsmith.store.retrieve_response_reservation.name;
		}
	
		await storeValue("photo_reservation", (!!photo) ? `${photo}` : null, false); //${appsmith.store.photo_url_reservations_prefix}`${photo}`
		return appsmith.store.photo_reservation;
	},		
	
		retrieve: async(fileName) => {
			if (appsmith.store.demo_mode || !appsmith.store.supabaseUrl || !appsmith.store.supabaseKey) {
				await storeValue("photo", appsmith.store.photo_default, false);
				if (appsmith.store.photo === null) { await storeValue('show_widget_camera', true) };
				return appsmith.store.photo;
			}
			const supabaseUrl = appsmith.store.supabaseUrl;
			const supabaseKey = appsmith.store.supabaseKey;
		fileName = fileName ?? appsmith.store.keys_contacts.contact_uuid;
		let retrieve_response = new supabase.SupabaseClient(supabaseUrl,supabaseKey);
		let photo = null;
		
		if (!!fileName) {
			const filePath = `${fileName}.png` ?? `${appsmith.store.keys_contacts.contact_uuid}.png`;
			const rsp = await retrieve_response.storage.from('images/avatars').getPublicUrl(filePath); 
			await storeValue("retrieve_response", { 'name': rsp.data.publicUrl }, false);	
			photo = String(await rsp.data.publicUrl ?? appsmith.store.retrieve_response.name);
		}
		await storeValue("photo", (!!photo) ? (photo.includes(js_utils_image.photo_url_contacts_prefix) ? `${photo}` : null): null, false);
		if (appsmith.store.photo === null) { await storeValue('show_widget_camera', true) };
		return appsmith.store.photo;
	},
	
	get_uuidv4: async() => {
		return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
	}, 
	
	get_uuid: async() => {
			console.log("entry - getUUID function");
			let prefix;

			let d = new Date().getTime();
			console.log("new date created -", d);
			d += (parseInt(Math.random() * 100)).toString();
			console.log(d, "random number generated by getUUID")
			if (undefined === prefix) {
				prefix = 'uid-';
			}
			d = prefix + d;
			console.log("UUID created -", d);
			console.log("exit - getUUID function")
			return d;
		},
}