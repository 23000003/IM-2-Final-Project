import { useEffect, useState } from "react";
import '../styles/ViewOrders.css';
import { useLocation } from "react-router-dom";
import useFetchComponentsHook from "../Supabase/ComponentsHook";
import nopfp from '../assets/nopfp.png'
import ConvertDate from "../Supabase/TimeConverter";
import supabase from "../Supabase/Supabase";
import emptydata from '../assets/EmptyData.jpg'

export default function ViewOrders() {
    
    const [viewUserInfo, setViewUserInfo] = useState({});
    const [triggerView, setTriggerView] = useState(false);
    const [approve, setApprove] = useState(false);
    const [history, setHistory] = useState([]);
    const [switchTab, setSwitchTab] = useState(true) // true if view orders false if view histopry
    const [confirmationButton, setConfirmButton] = useState(false)
    const [confirmType, setConfirmType] = useState('')
    const location = useLocation();
    
    const { 
        eBooks,
        viewOrders,
        DeclineOrder,
        ApproveOrder,
        CancelOrder,
        Release,
        setMessageContent,
        triggerMessage,
        setTriggerMessage,
        messageRef,
        SendMessageFunc,
        DontRelease,
        UpdateNotification,
        ConfirmButtonFunc
    } = useFetchComponentsHook("ViewOrders", location.state.user.account_name);
    
     console.log("HEYYY", viewOrders);

    useEffect(() => {
        document.body.style.backgroundColor = 'rgb(238, 238, 238)';

        const FetchHistory = async() =>{
            const {data, error} = await supabase.from('history')
            .select(`*, buyer_name(*)`)
            .eq('seller_name', location.state.user.account_name)
            .order('date_ordered', { ascending: false});

            console.log("HISTORYY",data)
            setHistory(data);
        }
        FetchHistory();
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [location]);
    
    const ViewOrder = (data) =>{
        if(triggerView === false){
            setViewUserInfo(data);
            setTriggerView(!triggerView);
            console.log(data)
        }else{
            setViewUserInfo({});
            setTriggerView(!triggerView);
        }
        
    }

    return (
        <>
        <div className="view-orders">
            <div className="flex-orders">
                <div className="view-order-label">
                    <div className="order-tabs">
                        <h3 onClick={() => setSwitchTab(true)}>Orders</h3>
                        <hr />
                        <h3 onClick={() => setSwitchTab(false)}>Order History</h3>
                    </div>
                </div>
                <div className="tab-order-picked">
                    <div style={{display: "flex"}}>
                        <h3 style={{marginBottom: "20px"}}>{switchTab ? "Your Orders" : "Your History Orders"}</h3>
                        <h4 style={{marginLeft: "8px", color: "grey"}}>{switchTab ? viewOrders.length : history.length}</h4>
                    </div>
                    <hr style={{width: "99%"}}/>
                </div>
                
                {switchTab ? (
                    <div className="order-contents-overflow">
                        <div className="order-contents1">
                            {viewOrders && viewOrders.length > 0 ? (
                                viewOrders.map((order, index) => (
                                    <>
                                    <div key={index} className="my-contents">
                                        <div className="user-content">
                                            <div className="user-div-content">
                                                <img src={order.buyer_name.profile} alt="" />
                                                <h3>{order.buyer_name.account_name}</h3>
                                            </div>
                                            <h3>Bought Item #{order.book_id}</h3>
                                            <h3>Ordered: {ConvertDate(order.date_ordered)} ago</h3>
                                            <button onClick={() => ViewOrder(order)}>View Details</button>
                                        </div>
                                    </div>
                                    
                                    </>
                                ))
                            ) : (
                                <div className="order-empty">
                                    <img src={emptydata} alt="" />
                                    <span>No Orders Yet ...</span>
                                </div> // Style this
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="order-contents-overflow">
                        <div className="order-contents1">
                            {history.length > 0 ? (
                                history.map((order, index) => (
                                    <>
                                    <div key={index} className="my-contents">
                                        <div className="user-content">
                                            <div className="user-div-content">
                                                <img src={order.buyer_name.profile} alt="" />
                                                <h3>{order.buyer_name.account_name}</h3>
                                            </div>
                                            <h3>Bought Item #{order.book_id}</h3>
                                            <h3> Closed: {ConvertDate(order.date_ordered)} ago</h3>
                                            <span className={order.isFailed ? "Failed" : "Success"}>{order.isFailed ? "Failed" : "Success"}</span>
                                        </div>
                                    </div>
                                    
                                    </>
                                ))
                            ) : (
                                <div className="order-empty">
                                    <img src={emptydata} alt="" />
                                    <span>No History Orders Yet ...</span>
                                </div> // Style this
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
        
        {triggerView && (
           <>
            <div className="outside" onClick={() => setTriggerView(!triggerView)}></div>
            <div className="order-user-information">
                <div className="order-user-name">
                    <img src={viewUserInfo.buyer_name.profile} alt="" />
                    <div>
                        <h3>{viewUserInfo.buyer_name.account_name} </h3>
                        <p>Buyer</p>
                        <svg onClick={() => setTriggerMessage(!triggerMessage)} 
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-dots-fill bi-message-icon" style={{margin: "4px 0px 0px 0px"}} viewBox="0 0 16 16">
                            <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        </svg>
                        {triggerMessage && (
                            <span className="send-a-message-details" ref={messageRef}>
                                <div style={{ display: "flex" }}>
                                    <input type="text"
                                        placeholder='Send A Message...'
                                        onChange={(e) => setMessageContent(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => SendMessageFunc(viewUserInfo.buyer_name.account_name)}
                                        width="16" height="16" fill="currentColor" className="bi bi-send-fill bi-message-icon" viewBox="0 0 16 16">
                                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                                    </svg>
                                </div>
                            </span>
                        )}
                    </div>
                    <span className="itemIdentify">{viewUserInfo.books.book_type}</span>
                </div>
                <hr />
                <div className="order-user-detailInfo">
                    <h5 style={{padding: "10px 0px 10px 0px", color: "#d3302f"}}>BUYER INFORMATION</h5>

                    {viewUserInfo.books.book_type === 'physical' ? (
                        <>
                        <div className="user-info-row">
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Full Name:</span>
                                    <span>{viewUserInfo.full_name}</span>
                                </div>
                            </div>
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Email:</span>
                                    <span>{viewUserInfo.buyer_name.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="user-info-row">
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Contact No:</span>
                                    <span>{viewUserInfo.contact_no}</span>
                                </div>
                            </div>
                            {viewUserInfo.order_type !== 'COD' ? (
                                <div className="user-info-column">
                                    <div className="user-column-label">
                                        <span>Reference Number:</span>
                                        <span>{viewUserInfo.ref_no}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="user-info-column">
                                    <div className="user-column-label">
                                        <span>Location:</span>
                                        <span>{viewUserInfo.location}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="user-info-row">
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Item Name:</span>
                                    <span>{viewUserInfo.books.book_title}</span>
                                </div>
                            </div>
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Quantity & Price:</span>
                                    <span>Qty: {viewUserInfo.quantity}, P{viewUserInfo.price}</span>
                                </div>
                            </div>
                        </div>
                        <div className="user-info-row">
                        {viewUserInfo.order_type === 'delivery' && (
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Location:</span>
                                    <span>{viewUserInfo.location}</span>
                                </div>
                            </div>
                        )}
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Order Type:</span>
                                    <h3 className="order-type">{viewUserInfo.order_type}</h3>
                                </div>
                            </div>
                        </div>
                        </>
                    ) : (
                        <>
                        <div className="user-info-row">
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Full Name</span>
                                    <span>{viewUserInfo.full_name}</span>
                                </div>
                            </div>
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Email</span>
                                    <span>{viewUserInfo.buyer_name.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="user-info-row">
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Reference No.</span>
                                    <span>{viewUserInfo.ref_no}</span>
                                </div>
                            </div>
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Contact No.</span>
                                    <span>{viewUserInfo.contact_no}</span>
                                </div>
                            </div>
                        </div>
                        <div className="user-info-row">
                            <div className="user-info-column">
                                <div className="user-column-label">
                                    <span>Price</span>
                                    <span>P{viewUserInfo.price}.00</span>
                                </div>
                            </div>
                        </div>
                        </>
                    )}
                    {/* price, quantity, ref, buyer name, 
                        buyer full_name, buyer-contact no,
                        buyer email, location, ordertype*/}
                </div>
                <hr />
                <div className="order-user-buttonApp">
                    {viewUserInfo.books.book_type === 'physical' ? (
                        !viewUserInfo.accept ? (
                            <>
                            <button onClick={() =>{setConfirmButton(true),setConfirmType("Decline")}}>Decline Order</button>
                            <button onClick={() =>{setConfirmButton(true), setConfirmType('Approve')}}>Approve Order</button>
                            </>
                        ):(
                            <button onClick={() =>{setConfirmButton(true),setConfirmType("Order-Canceled")}}>Order Canceled</button>
                        )
                    ) : (
                        <>
                        <button onClick={() => {setConfirmButton(true), setConfirmType('Dont-Release')}}>Don't Release</button>
                        <button onClick={() => {setConfirmButton(true), setConfirmType('Release')}}>Release</button>
                        </>
                    )}
                </div>
                          
                {confirmationButton && (
                <>
                    <div className="exposure expoconfir"></div>
                    <div className="confirmation">
                        <h3>Confirm {confirmType}?</h3>
                        <div className="confirmation-buttons">
                            <button onClick={() => {setConfirmButton(false), setConfirmType('')}}>
                                Decline
                            </button>
                            <button onClick={() => ConfirmButtonFunc(viewUserInfo, confirmType)}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </>
                )}
            </div>
           </>
        )}
        </>
    );
}
