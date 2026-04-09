import React from 'react';
import EditableTable from './EditableTable';
import StatCard from '../UI/StatCard';
import classes from './AdminHome.module.css';

const AdminHome = () => {
  return (
    <div className={classes.dashboard}>
      <header className={classes.header}>
        <h1 className={classes.title}>Admin Control Center</h1>
        <p className={classes.subtitle}>Manage restaurants, users, and platform activity.</p>
      </header>

      <div className={classes.statsGrid}>
        <StatCard 
          title="Total Restaurants" 
          value="128" 
          icon="restaurant" 
          trend="up" 
          trendValue="12" 
        />
        <StatCard 
          title="Active Users" 
          value="1,452" 
          icon="group" 
          trend="up" 
          trendValue="8" 
        />
        <StatCard 
          title="Pending Approvals" 
          value="14" 
          icon="pending_actions" 
          trend="down" 
          trendValue="3" 
        />
        <StatCard 
          title="Today's Revenue" 
          value="$2,450" 
          icon="payments" 
        />
      </div>

      <section className={classes.tableSection}>
        <div className={classes.tableHeader}>
          <h2 className={classes.tableTitle}>Master Data Management</h2>
          <div className={classes.tableActions}>
            <button className={classes.exportButton}>
              <span className="material-symbols-outlined">download</span>
              Export CSV
            </button>
          </div>
        </div>
        <div className={classes.tableContainer}>
          <EditableTable />
        </div>
      </section>
    </div>
  );
};

export default AdminHome;