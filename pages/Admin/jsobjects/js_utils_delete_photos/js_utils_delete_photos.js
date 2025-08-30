export default {
	async delete_photos() {
		const delete_array = await js_utils_delete_photos.get_older_than();
		console.log(delete_array);
		
		let delete_response = new supabase.SupabaseClient(appsmith.store.supabaseUrl,appsmith.store.supabaseKey);
		const del_rsp = await delete_response.storage.from('images').remove([...delete_array]);
		
		if (del_rsp.error) {
			console.log(await del_rsp.error);
			await showAlert("Failed to delete reservation photos older than 7 days.");
			return del_rsp;
			
		} else {
			showAlert("Deleted reservation photos older than 7 days.");
			return del_rsp;
		}
		
	},
	
	
	
	async get_older_than (interval="7 days", folder="posts/%") {
		const photos = await files_older_than.run({"key": interval, "folder": folder});
		const array = await photos.map(record=>(record.filepath));
		
		return array;
	},
	
	
	
	// retrieve: async(fileName) => {
		// let retrieve_response = new supabase.SupabaseClient(appsmith.store.supabaseUrl,appsmith.store.supabaseKey);
		// let photo = null;
		// 
		// if (!!fileName) {
			// const filePath = `${fileName}.png` ?? `${appsmith.store.keys_contacts.contact_uuid}.png`;
			// const rsp = await retrieve_response.storage.from('images').list('', {search: filePath});
			// // let rsp = await new supabase.SupabaseClient(appsmith.store.supabaseUrl,appsmith.store.supabaseKey)
				// // .storage
				// // .from('images')
				// // .getPublicUrl(filePath, {download: true} ) //, transform: {width: 100, height: 100,} })
			// 
			// await storeValue("retrieve_response", { 'name': null, ...rsp.data.slice().shift()});
			// photo = await appsmith.store.retrieve_response.name;
		// }
	// 
		// await storeValue("photo", (!!photo) ? `${appsmith.store.photo_url_prefix}${photo}` : null);
		// return appsmith.store.photo;
	// },	
		
}