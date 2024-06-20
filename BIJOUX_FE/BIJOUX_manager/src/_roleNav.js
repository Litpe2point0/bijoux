import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  HardDrives,
  MagicWand,
  Gauge,
  Users,
  ShoppingCartSimple,
  FileText,
  IdentificationCard,
  Cube,
  ClipboardText,
  ShoppingBagOpen,
  ArrowCircleRight
} from "phosphor-react";
import { GiDoorRingHandle, GiBigDiamondRing, GiGemPendant, GiCheckeredDiamond, GiMetalBar } from "react-icons/gi";
import { FcOnlineSupport, FcFactoryBreakdown } from "react-icons/fc";



const get_roleNav = (role_id, account_id) => {
  //alert('ngu')
  const _roleNav = [
    [],
    // manager ID: 1   
    [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <Gauge size={35} color="red" weight="duotone" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      {
        component: CNavTitle,
        name: 'Accounts Management',
      },
      {
        component: CNavItem,
        name: 'Customers',
        to: '/customers/table',
        icon: <Users size={35} color="red" weight="duotone" />,

      },
      {
        component: CNavItem,
        name: 'Staffs',
        to: '/staffs_manager/table',
        icon: <IdentificationCard size={35} color="red" weight="duotone" />,

      },
      {
        component: CNavTitle,
        name: 'Orders Management',
      },
      {
        component: CNavGroup,
        name: 'Quotes',
        to: '/quotes_manager',
        icon: <FileText size={35} color="red" weight="duotone" />,
        items: [
          {
            component: CNavItem,
            name: 'Main Quotes List',
            to: '/quotes_manager/table',
            icon: <ArrowCircleRight size={13} color="lightsalmon" weight="duotone" />

          },
          {
            component: CNavItem,
            name: 'Price Reporting',
            to: '/quotes_manager/price_reporting',
            icon: <ArrowCircleRight size={13} color="lightsalmon" weight="duotone" />

          },

        ],
      },
      {
        component: CNavGroup,
        name: 'Orders',
        to: '/orders_manager',
        icon: <ShoppingCartSimple size={35} color="red" weight="duotone" />,
        items: [
          {
            component: CNavItem,
            name: 'Main Orders List',
            to: '/orders_manager/table',
            icon: <ArrowCircleRight size={13} color="lightsalmon" weight="duotone" />

          },
          {
            component: CNavItem,
            name: 'Price reporting',
            to: '/orders_manager/price_reporting',
            icon: <ArrowCircleRight size={13} color="lightsalmon" weight="duotone" />
          },

        ],
      },
      {
        component: CNavTitle,
        name: 'Resources Management',
      },
      {
        component: CNavGroup,
        name: 'Resources',
        to: '/resources',
        icon: <HardDrives size={35} color="red" weight="duotone" />

        ,
        items: [
          {
            component: CNavGroup,
            name: 'Mounting',
            to: '/mounting',
            icon: <Cube size={30} color="hotpink" weight="duotone" />,
            items: [
              {
                component: CNavItem,
                name: 'Ring',
                to: '/mounting/ring/table',
                icon: <GiBigDiamondRing size={20} color="mediumspringgreen" weight="duotone" />,
              },
              {
                component: CNavItem,
                name: 'Band',
                to: '/mounting/band/table',
                icon: <GiDoorRingHandle size={20} color="mediumspringgreen" />,
              },
              {
                component: CNavItem,
                name: 'Pendant',
                to: '/mounting/pendant/table',
                icon: <GiGemPendant size={20} color="mediumspringgreen" />,
              },
            ],
          },
          {
            component: CNavGroup,
            name: 'Material',
            to: '/material',
            icon: <Cube size={30} color="hotpink" weight="duotone" />,
            items: [
              {
                component: CNavItem,
                name: 'Metal Price Table',
                to: '/material/metal/table',
                icon: <GiMetalBar size={20} color="mediumspringgreen" weight="duotone" />

              },
              {
                component: CNavItem,
                name: 'Diamond Price Table',
                to: '/material/diamond/table',
                icon: <GiCheckeredDiamond size={20} color="mediumspringgreen" weight="duotone" />

              },

            ],
          },

        ],
      },









      // {
      //   component: CNavItem,
      //   name: 'Product',
      //   to: '/product/table',
      //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'info',
      //     text: 'NEW',
      //   },
      // },
      // {
      //   component: CNavGroup,
      //   name: 'Product',
      //   to: '/product',
      //   icon: <HardDrives size={20} color="hotpink" weight="duotone" />,
      //   items: [
      //     {
      //       component: CNavItem,
      //       name: 'Table',
      //       to: '/product/table',
      //     },
      //     {
      //       component: CNavItem,
      //       name: 'Add',
      //       to: '/product/add',
      //     },

      //   ],
      // },
      // {
      //   component: CNavItem,
      //   name: 'Customize items',
      //   to: '/ItemsManage',
      //   icon: <MagicWand size={20} color="hotpink" weight="duotone" />,  //cil-fastfood
      //   badge: {
      //     color: 'info',
      //     text: 'NEW',
      //   },
      // }


    ],
    // sale_staff ID: 2
    [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <Gauge size={35} color="red" weight="duotone" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      {
        component: CNavTitle,
        name: 'Accounts Management',
      },
      {
        component: CNavItem,
        name: 'Customers',
        to: '/customers/table',
        icon: <Users size={35} color="red" weight="duotone" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      {
        component: CNavTitle,
        name: 'Orders Management',
      },
      {
        component: CNavItem,
        name: 'Assigned Quotes',
        //disabled: account_id == 7,
        to: '/quotes_sale_staff/table',
        //icon: <FileText size={35} color={account_id == 7 ? "gray": "red"} weight="duotone" />,  //cil-fastfood
        icon: <FileText size={35} color={"red"} weight="duotone" />,  //cil-fastfood

        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      {
        component: CNavGroup,
        name: 'Assigned Orders',
        to: '/orders_sale_staff',
        icon: <ShoppingCartSimple size={35} color="red" weight="duotone" />,  //cil-fastfood
        items: [
          {
            component: CNavItem,
            name: 'Main Orders List',
            to: '/orders_sale_staff/table',
            icon: <ArrowCircleRight size={13} color="lightsalmon" weight="duotone" />

          },
          {
            component: CNavItem,
            name: 'Design Processes',
            to: '/orders_sale_staff/design_process',
            icon: <ArrowCircleRight size={13} color="lightsalmon" weight="duotone" />

          },

        ],
      }
    ],
    // design_staff ID: 3
    [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <Gauge size={35} color="red" weight="duotone" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      {
        component: CNavTitle,
        name: 'Orders Management',
      },
      {
        component: CNavGroup,
        name: 'Assigned Orders',
        to: '/orders_design_staff',
        icon: <ShoppingCartSimple size={35} color="red" weight="duotone" />,  //cil-fastfood
        items: [
          {
            component: CNavItem,
            name: 'Main Orders List',
            to: '/orders_design_staff/table',
            icon: <ArrowCircleRight size={13} color="lightsalmon" weight="duotone" />

          },
          {
            component: CNavItem,
            name: 'Design Processes',
            to: '/orders_design_staff/design_process',
            icon: <ArrowCircleRight size={13} color="lightsalmon" weight="duotone" />

          },

        ],
      }
    ],
    // production_staff ID: 4
    [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <Gauge size={35} color="red" weight="duotone" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      {
        component: CNavTitle,
        name: 'Orders Management',
      },
      {
        component: CNavGroup,
        name: 'Assigned Orders',
        to: '/orders_production_staff',
        icon: <FcFactoryBreakdown size={35} color="red" weight="duotone" />,
        items: [
          {
            component: CNavItem,
            name: 'Main Orders List',
            to: '/orders_production_staff/table',
            icon: <ArrowCircleRight size={13} color="lightsalmon" weight="duotone" />

          },
          {
            component: CNavItem,
            name: 'Completed Orders',
            to: '/orders_design_staff/completed_orders',
            icon: <ArrowCircleRight size={13} color="lightsalmon" weight="duotone" />

          },

        ],
      }

    ],
  ]
  const roleNav = role_id ? _roleNav[role_id] : _roleNav[0];
  //console.log('roleNav',roleNav)

  return roleNav;
}



export default get_roleNav
