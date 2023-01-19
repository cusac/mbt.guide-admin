import Tags from '../components/views/tags/Tags.vue';
import TagDetails from '../components/views/tags/TagDetails.vue'

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
  {
    path: '/tags/:_id',
    beforeEnter: (to, from, next) => {
      next();
    },
    component: TagDetails,
    name: 'TagDetails',
    meta: {
      description: 'Matches for selected tag',
      title: 'Tag Details',
      requiresAuth: true,
    }
  },
];

export default routes;
