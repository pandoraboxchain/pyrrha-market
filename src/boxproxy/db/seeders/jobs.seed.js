export default {
    name: 'jobs',

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('jobs', {});
    }
};
