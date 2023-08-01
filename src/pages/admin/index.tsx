import React, { ReactNode } from 'react'
import AdminAreaLayout from '~/components/AdminAreaLayout'
import AdminHome from '~/components/admin/AdminHome'

type Props = {}

const AdminPage = (props: Props) => {
  return (
    <AdminHome />
  )
}

export default AdminPage
AdminPage.getLayout = (page: ReactNode) => {
    return <AdminAreaLayout>{page}</AdminAreaLayout>
}