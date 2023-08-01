import React, { ReactNode } from 'react'
import AdminAreaLayout from '~/components/AdminAreaLayout'

type Props = {}

const AdminPage = (props: Props) => {
  return (
    <div>AdminPage</div>
  )
}

export default AdminPage
AdminPage.getLayout = (page: ReactNode) => {
    return <AdminAreaLayout>{page}</AdminAreaLayout>
}