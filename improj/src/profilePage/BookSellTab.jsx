import useSellHook from "./SellTabHook";
import FetchBook from "./profileDataHook";
import { useState, useRef } from "react";
import '../styles/responsive.css'
import emptydata from '../assets/EmptyData.jpg'
import UserHook from "../Supabase/UserSessionData";

export default function BookSellTab(){

    const {user} = UserHook();

    const [data, setData] = useState([]);
    const [ItemTrigger, setItemTrigger] = useState(false);
    const [ confirmationButton,setConfirmButton] = useState(false);

    const ViewItem = (data) =>{
        setItemTrigger(true);
        setData(data);
        document.body.style.overflow = "hidden";
        console.log(data);
    }

    const ExitViewItem = () =>{
        setItemTrigger(false);
        document.body.style.overflow = "auto";
    }

    const { tabData, loading } = FetchBook('books_sell', user.account_name)
    
    const { 
        CancelandEditItem, 
        ItemUpdate, 
        ItemSold,
        setItemName,
        setItemDescription,
        setItemQuantity,
        setItemPrice
    
    } = useSellHook(ExitViewItem);
    
    const visibility = useRef([]);
    visibility.current = [
        useRef(null), 
        useRef(null)
    ];
    
    const enableInput = useRef([]);
    enableInput.current = [
      useRef(null),
      useRef(null),
      useRef(null), 
      useRef(null), 
    ];


    console.log("sell", tabData)
    console.log("loading", loading)
    return(
        <div className="ItemSale">
            {loading ? (
                <div className="grid-row grid-4-4">
                    <div className="cards">
                        <div className="card_image loading1"></div>
                        <div className="card_title loading1"></div>
                        <div className="card_description loading1"></div>
                    </div>
                    <div className="cards">
                        <div className="card_image loading1"></div>
                        <div className="card_title loading1"></div>
                        <div className="card_description loading1"></div>
                    </div>
                    <div className="cards">
                        <div className="card_image loading1"></div>
                        <div className="card_title loading1"></div>
                        <div className="card_description loading1"></div>
                    </div>
                    <div className="cards">
                        <div className="card_image loading1"></div>
                        <div className="card_title loading1"></div>
                        <div className="card_description loading1"></div>
                    </div>
                    <div className="cards">
                        <div className="card_image loading1"></div>
                        <div className="card_title loading1"></div>
                        <div className="card_description loading1"></div>
                    </div>
                </div>    
                ) : (
                tabData.length > 0 ? (
                    tabData.map((book, index) =>(
                        <div key={index} className="on-sale">
                            <div className="quantity-onsale">{book.books.book_type === "e-book" ? "E - Book" : `Quantity: ${book.books.book_quantity}`}</div>
                            {!book.books.isApprove && <div className="genre-onsale">In Approval</div>}
                            <div className="sell">
                                <button className="sell-button" onClick={() => ViewItem(book)}>View Item</button>
                            </div>
                            <div className="on-sale-image">
                                <img src={book.books.imagetag} alt="Book Image" />
                            </div>
                            <div className="on-sale-text">
                                <hr />
                                <span>{book.books.book_title}</span>
                                <span>₱{book.books.book_price}.00</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-data">
                        <img src={emptydata} />
                        <h2>Post a book now ...</h2>
                    </div>
                )
            )}
            
            
            {ItemTrigger && (
                <>
                <div className="exposure" onClick={() => ExitViewItem()}></div>
                <div className="Sell-container">
                    <div className="sell-image">
                        <div className="sell-image2">
                            <img src={data.books.imagetag}/>
                        </div>
                        
                    </div>
                    <div className="sell-details">
                        <h3>Item Details:</h3>

                        <div className="sell-texts">
                            <span>
                                Item Name: <input
                                type="text"
                                id="item-title"
                                placeholder={data.books.book_title}
                                ref={enableInput.current[0]}
                                onChange={(e) => setItemName(e.target.value)}
                                disabled
                                />
                            </span>
                            <span>
                                Item Price: <input
                                type="text"
                                id="item-price"
                                placeholder={`P${data.books.book_price}.00`}
                                ref={enableInput.current[1]}
                                onChange={(e) => setItemPrice(e.target.value)}
                                disabled
                                />
                            </span>
                            <span>
                                Quantity: <input
                                type="text"
                                id="item-quantity"
                                placeholder={data.books.book_quantity}
                                ref={enableInput.current[2]}
                                onChange={(e) => setItemQuantity(e.target.value)}
                                disabled
                                />
                            </span>
                            <span>Description: </span>
                            <textarea
                                id="item-description"
                                placeholder={data.books.description}
                                ref={enableInput.current[3]}
                                onChange={(e) => setItemDescription(e.target.value)}
                                disabled
                                >
                            </textarea>
                        </div>

                        <div className="buttonsold">

                            <button id="itemcancel" ref={visibility.current[0]} onClick={() => 
                                CancelandEditItem(visibility, enableInput, 'hidden', true)
                            }>X Cancel</button>
                            
                            <button id="itemupdate" ref={visibility.current[1]} onClick={() =>
                                ItemUpdate(data)
                            }>Update</button>            
                            
                            <button id="itemedit" onClick={() => 
                                CancelandEditItem(visibility, enableInput, 'visible', false)}
                            >Edit Item</button> 
                            
                            <button id="itemsold" onClick={() =>
                                setConfirmButton(true)
                            }>Mark As Sold</button>

                        </div>
                    </div>
                    {confirmationButton && (
                    <>
                        <div className="exposure expoconfir"></div>
                        <div className="confirmation">
                            <h3>Confirm Mark as Sold?</h3>
                            <div className="confirmation-buttons">
                                <button onClick={() => {setConfirmButton(false)}}>
                                    Decline
                                </button>
                                <button onClick={() => ItemSold(data)}>
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </>
                    )}
                </div>
                </>
            )}
            
        </div>
    );
}