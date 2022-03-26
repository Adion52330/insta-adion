import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: "pd16nsm7",
  dataset: 'production',
  apiVersion: '2021-11-16',
  useCdn: true,
  token: "sk1JI8vFROg6L6UgboF5Z4c4tQM3ppkZBVVNtU64QQHo9Gn4njFo4vOXPZioJM0rlas6DbBlU6yC6tjqbpkOCCbwa25cWw3eTtq5wJT1BpcpyPZyJfk6sImjo6qEo29wHCsjlM0ae6sAZiNIChvVQqgEu1hvBl96jtBrl1nmb0i0pmyhh5WE",
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);