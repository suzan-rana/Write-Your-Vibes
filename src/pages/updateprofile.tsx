import React from 'react'
import Layout from '~/components/ui/Layout'

type Props = {}

const UpdateProfilePage = (props: Props) => {
  return (
    <div>UpdateProfilePage</div>
  )
}

export default UpdateProfilePage
UpdateProfilePage.getLayout = (page: React.ReactElement) => {
    return <Layout>{page}</Layout>;
  };