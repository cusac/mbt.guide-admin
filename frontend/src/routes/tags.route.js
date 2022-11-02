import Tags from '../components/views/tags/Tags.vue';

const routes = [
  {
    path: 'tags',
    component: Tags,
    name: 'Tags',
    meta: {
      description: 'List of tags',
      title: 'Tags',
      requiresAuth: true,
    },
  },
];

export default routes;
