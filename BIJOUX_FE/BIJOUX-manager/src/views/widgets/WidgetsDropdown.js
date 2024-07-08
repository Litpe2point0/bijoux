import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CButton,
  CSpinner,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { get_dashboard } from '../../api/main/orders/Order_api'

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  const [months, setMonths] = useState(props.data.months);
  const [user, setUser] = useState(props.data.user);
  const [profit, setProfit] = useState(props.data.profit);
  const [order, setOrder] = useState(props.data.order);

  // const [order_deposit, setOrderDeposit] = useState(null);
  // const [order_design, setOrderDesign] = useState(null);
  // const [order_production, setOrderProduction] = useState(null);
  // const [order_payment, setOrderPayment] = useState(null);
  // const [order_delivery, setOrderDelivery] = useState(null);

  // useEffect(() => {


  //   const data = props.data;
  //   setMonths(data.months);
  //   setUser(data.user);
  //   setProfit(data.profit);
  //   setOrder(data.order);
  //   // setOrderDeposit(data.order_deposit);
  //   // setOrderDesign(data.order_design);
  //   // setOrderProduction(data.order_production);
  //   // setOrderPayment(data.order_payment);
  //   // setOrderDelivery(data.order_delivery);
  //   setLoading(false);

  // }, [])


  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (

    <>
      <CRow className={props.className} xs={{ gutter: 4 }}>
        <CCol sm={6} xl={4}  xxl={4}>
          <CWidgetStatsA
            color="primary"
            value={
              <>
                {user.user_year}{' '}
                <span className="fs-6 fw-normal">
                  (+{user.this_month} <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Customers"
            // action={
            //   <CDropdown alignment="end">
            //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
            //       <CIcon icon={cilOptions} />
            //     </CDropdownToggle>
            //     <CDropdownMenu>
            //       <CDropdownItem>Action</CDropdownItem>
            //       <CDropdownItem>Another action</CDropdownItem>
            //       <CDropdownItem>Something else here...</CDropdownItem>
            //       <CDropdownItem disabled>Disabled action</CDropdownItem>
            //     </CDropdownMenu>
            //   </CDropdown>
            // }
            chart={
              <CChartLine
                ref={widgetChartRef1}
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: months,
                  datasets: [
                    {
                      label: 'Register Count',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: getStyle('--cui-primary'),
                      data: user.user_month,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: 0,
                      max: user.user_month.reduce((maxItem, currentItem) => {
                        return currentItem > maxItem ? currentItem : maxItem;
                      }, user.user_month[0]) * 1.1,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                      tension: 0.4,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={6} xl={4}  xxl={4}>
          <CWidgetStatsA
            color="info"
            value={
              <>
                {profit.profit_year}{' '}
                <span className="fs-6 fw-normal">
                  (+{profit.this_month} <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Revenue"
            // action={
            //   <CDropdown alignment="end">
            //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
            //       <CIcon icon={cilOptions} />
            //     </CDropdownToggle>
            //     <CDropdownMenu>
            //       <CDropdownItem>Action</CDropdownItem>
            //       <CDropdownItem>Another action</CDropdownItem>
            //       <CDropdownItem>Something else here...</CDropdownItem>
            //       <CDropdownItem disabled>Disabled action</CDropdownItem>
            //     </CDropdownMenu>
            //   </CDropdown>
            // }
            chart={
              <CChartLine
                ref={widgetChartRef2}
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: months,
                  datasets: [
                    {
                      label: 'Profit Sum',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: getStyle('--cui-info'),
                      data: profit.profit_month,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: 0,
                      max: profit.profit_month.reduce((maxItem, currentItem) => {
                        return currentItem > maxItem ? currentItem : maxItem;
                      }, profit.profit_month[0]) * 1.1,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={6} xl={4}  xxl={4}>
          <CWidgetStatsA
            color="warning"
            value={
              <>
                {order.order_year}{' '}
                <span className="fs-6 fw-normal">
                  (+{order.this_month} <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Orders"
            // action={
            //   <CDropdown alignment="end">
            //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
            //       <CIcon icon={cilOptions} />
            //     </CDropdownToggle>
            //     <CDropdownMenu>
            //       <CDropdownItem>Action</CDropdownItem>
            //       <CDropdownItem>Another action</CDropdownItem>
            //       <CDropdownItem>Something else here...</CDropdownItem>
            //       <CDropdownItem disabled>Disabled action</CDropdownItem>
            //     </CDropdownMenu>
            //   </CDropdown>
            // }
            chart={
              <CChartLine
                className="mt-3"
                style={{ height: '70px' }}
                data={{
                  labels: months,
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(255,255,255,.2)',
                      borderColor: 'rgba(255,255,255,.55)',
                      data: order.order_month,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      min: 0,
                      max: order.order_month.reduce((maxItem, currentItem) => {
                        return currentItem > maxItem ? currentItem : maxItem;
                      }, order.order_month[0]) * 1.1,
                      display: false,
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        {/* <CCol sm={6} xl={4}  xxl={4}>
              <CWidgetStatsA
                color="danger"
                value={
                  <>
                    44K{' '}
                    <span className="fs-6 fw-normal">
                      (-23.6% <CIcon icon={cilArrowBottom} />)
                    </span>
                  </>
                }
                title="Sessions"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem>Action</CDropdownItem>
                      <CDropdownItem>Another action</CDropdownItem>
                      <CDropdownItem>Something else here...</CDropdownItem>
                      <CDropdownItem disabled>Disabled action</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                }
                chart={
                  <CChartBar
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                        'January',
                        'February',
                        'March',
                        'April',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                          barPercentage: 0.6,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                }
              />
            </CCol> */}

      </CRow>

    </>



  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
