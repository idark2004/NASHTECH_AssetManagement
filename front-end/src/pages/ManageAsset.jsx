import React from 'react'

import Header from "../components/Header"
import MenuBar from '../components/Menu'
import AssetTable from '../components/manage_asset/AssetTable'
import AssetFunction from '../components/manage_asset/AssetFunction'

const ManageAsset = () => {
    return (
        <div>
            <Header />
            <div className="container">
                <div className="manage-asset">
                    <MenuBar />
                    <div className="content">
                        <AssetFunction />
                        <AssetTable />
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    )
}

export default ManageAsset
