export default {
	async delete_photos() {
		const delete_array = await js_utils_delete_photos.get_older_than();
		console.log(delete_array);

		if (appsmith.store.demo_mode || !appsmith.store.supabaseUrl || !appsmith.store.supabaseKey) {
			return { data: [], error: null };
		}
		let delete_response = new supabase.SupabaseClient(appsmith.store.supabaseUrl,appsmith.store.supabaseKey);
		const del_rsp = await delete_response.storage.from('images').remove([...delete_array]);
		
		if (del_rsp.error) {
			console.log(await del_rsp.error);
			//await showAlert("Failed to delete reservation photos older than 7 days.");
			return del_rsp;
			
		} else {
			//showAlert("Deleted reservation photos older than 7 days.");
			return del_rsp;
		}
		
	},
	
	
	async get_older_than (interval="7 days", folder="posts/%") {
		const photos = await files_older_than.run({"key": interval, "folder": folder});
		const array = await photos.map(record=>(record.filepath));
		
		return array;
	},
	
}