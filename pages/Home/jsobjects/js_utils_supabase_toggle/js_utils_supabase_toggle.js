export default {
	enable: async (url, key) => {
		await storeValue('supabaseUrl', url?.trim() ?? '');
		await storeValue('supabaseKey', key?.trim() ?? '');
		await storeValue('demo_mode', !(!!url && !!key));
		return { demo_mode: appsmith.store.demo_mode, supabaseUrl: appsmith.store.supabaseUrl };
	},
	
	disable: async () => {
		await storeValue('supabaseUrl', '');
		await storeValue('supabaseKey', '');
		await storeValue('demo_mode', true);
		return { demo_mode: appsmith.store.demo_mode };
	},

	status: async () => {
		return {
			demo_mode: !!appsmith.store.demo_mode,
			enabled: !!(appsmith.store.supabaseUrl && appsmith.store.supabaseKey),
			supabaseUrl: appsmith.store.supabaseUrl ?? ''
		};
	}
}
