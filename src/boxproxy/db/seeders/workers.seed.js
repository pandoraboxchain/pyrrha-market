export default {
    name: 'workers',

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('workers', {});
    }
};
