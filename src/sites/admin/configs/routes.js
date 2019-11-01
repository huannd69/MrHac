import React from 'react';
import Authorization from '../../../securities/Authorization'
import Loadable from 'react-loadable';

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import('../containers/dashboard'),
  loading: Loading,
});

const User = Loadable({
  loader: () => import('../containers/user'),
  loading: Loading,
})

const Doctor = Loadable({
  loader: () => import('../containers/doctor'),
  loading: Loading,
})

const MgrAdmin = Loadable({
  loader: () => import('../containers/mgr-admin'),
  loading: Loading,
})

const Post = Loadable({
  loader: () => import('../containers/post'),
  loading: Loading,
})

const MgrRole = Loadable({
  loader: () => import('../containers/role'),
  loading: Loading,
})

const MgrHospital = Loadable({
  loader: () => import('../containers/hospital'),
  loading: Loading,
})

const MgrDetailHospital = Loadable({
  loader: () => import('../containers/hospital/detail-hospital'),
  loading: Loading,
})

const MgrDetailWallets = Loadable({
  loader: () => import('../containers/hospital/detail-wallets'),
  loading: Loading,
})

const MgrRegisteredDoctor = Loadable({
  loader: () => import('../containers/doctor-inf'),
  loading: Loading,
})

const MgrSpecialist = Loadable({
  loader: () => import('../containers/specialist'),
  loading: Loading,
})

const MgrServiceType = Loadable({
  loader: () => import('../containers/serviceType'),
  loading: Loading,
})

const MgrBooking = Loadable({
  loader: () => import('../containers/booking'),
  loading: Loading,
})
const MgrTicket = Loadable({
  loader: () => import('../containers/ticket'),
  loading: Loading,
})
const TicketInfo = Loadable({
  loader: () => import('../containers/ticket/ticket-controller'),
  loading: Loading,
})
const MedicineCategory = Loadable({
  loader: () => import('../containers/medicine-category'),
  loading: Loading,
})

const UserTracking = Loadable({
  loader: () => import('../containers/user-tracking'),
  loading: Loading,
})

const ImportUser = Loadable({
  loader: () => import('../containers/user-tracking/importexcel'),
  loading: Loading,
})
const Advertise = Loadable({
  loader: () => import('../containers/advertise'),
  loading: Loading,
})

const Voucher = Loadable({
  loader: () => import('../containers/voucher'),
  loading: Loading,
})

const AddVoucher = Loadable({
  loader: () => import('../containers/voucher/AddVoucher'),
  loading: Loading,
})

const EditVoucher = Loadable({
  loader: () => import('../containers/voucher/EditVoucher'),
  loading: Loading,
})

const ReadFile = Loadable({
  loader: () => import('../containers/voucher/ReadFile'),
  loading: Loading,
})

const Wallets = Loadable({
  loader: () => import('../containers/transaction'),
  loading: Loading,
})


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  // { path: '/admin/dashboard', name: "Dashboard", component: Dashboard },
  { path: '/admin/user', name: "", component: User },
  { path: '/admin/doctor', name: "", component: Doctor },
  { path: '/admin/mgr-admin', name: "", component: MgrAdmin },
  { path: '/admin/post', name: "", component: Post },
  { path: '/admin/role', name: "", component: MgrRole },
  { path: '/admin/hospital', name: "", component: MgrHospital },
  { path: '/admin/detail-hospital/:id', name: "", component: MgrDetailHospital },
  { path: '/admin/wallets-hospital/:id', name: "", component: MgrDetailWallets },
  { path: '/admin/doctor-inf', name: "", component: MgrRegisteredDoctor },
  { path: '/admin/specialist', name: "", component: MgrSpecialist },
  { path: '/admin/service-type', name: "", component: MgrServiceType },
  { path: '/admin/booking', name: "", component: MgrBooking },
  { path: '/admin/ticket', name: "", component: MgrTicket },
  { path: '/admin/ticket-controller', name: "", component: TicketInfo },
  { path: '/admin/medicine-category', name: "", component: MedicineCategory },
  { path: '/admin/user-tracking', name: "", component: UserTracking },
  { path: '/admin/import-user', name: "", component: ImportUser },
  { path: '/admin/voucher', name: "", component: Voucher },
  { path: '/admin/add-voucher', name: "", component: AddVoucher },
  { path: '/admin/edit-voucher/:id', name: "", component: EditVoucher },
  { path: '/admin/advertise', name: "", component: Advertise },
  { path: '/admin/import-voucher-user', name: "", component: ReadFile },
  { path: '/admin/user-info', name: "", component: Wallets },
  { path: '/admin/transaction', name: "", component: Wallets }
]

export default routes;
