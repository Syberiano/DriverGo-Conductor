export default ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    permissions: [
      ...(config.android?.permissions || []),
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
    ],
    config: {
      ...config.android?.config,
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY,
      },
    },
  },
});
