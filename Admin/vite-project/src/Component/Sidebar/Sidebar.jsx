// import React from 'react';
import './Sidebar.css'
import {Link} from 'react-router-dom'
import add_product_icon from '../../Admin Panel Assets/Product_Cart.svg'
import list_product_icon from '../../Admin Panel Assets/Product_list_icon.svg'
const Sidebar = () =>{
    return (
        <div className='sidebar'>
            <Link to={'/addproduct'} style={{textDecoration:"none"}}> 
            <div className='sidebar-item'>
                <img src={add_product_icon} alt=''></img>
                <p>Add Product_icon</p>
            </div>
            </Link><Link to={'/listproduct'} style={{textDecoration:"none"}}> 
            <div className='sidebar-item'>
                <img src={list_product_icon} alt=''></img>
                <p>Product List</p>
            </div>
            </Link>

        </div>
    );
}

export default Sidebar;