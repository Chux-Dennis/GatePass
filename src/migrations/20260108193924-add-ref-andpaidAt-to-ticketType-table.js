'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("orders","ref",{
      type:Sequelize.STRING,
      allowNull:false
    })

    await queryInterface.addColumn("orders","paidAt",{
      type:Sequelize.DATE,
      allowNull:true
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn("orders","ref")

    await queryInterface.removeColumn("orders","paidAt")

  }
};
