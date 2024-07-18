import { useState } from "react"
import supabase from "../Supabase/Supabase"
import useEditData from "./EditDataDetails";

export default function useApproveDecline(){

    const [loadingAD, setLoadingAD] = useState(false);
    const { handleApprove } = useEditData();

    const UpdateUser = async (user) =>{ // make functionality if wala na then click to false
        const {error} = await supabase.from('Accounts')
        .update({
            isPosted: false
        })
        .eq('account_name', user)
    }

    const Approve = async (user, type) =>{
        setLoadingAD(true);
        const bookType = type ? 'physical' : 'e-book';

        const {error} = await supabase.from('books')
        .update({
            isApprove: true
        })
        .eq('account_name', user)
        .eq('isApprove', false)
        .eq('book_type', bookType);

        if(error){
            console.log(error);
            alert("error approve")
            setLoadingAD(false);
        }else{
            setLoadingAD(false);
            alert("Approved Successful")
        }

    }

    // if decline, it message reply should pop up and sends via email
    // if user still has books posted or ebooks, dont turn isPosted to false

    const SingleDecline = async (id, imagetag, file, type) =>{
        setLoadingAD(true);
        const bookType = type ? 'physical' : 'e-book';

        const {error:sellError} = await supabase.from('books_sell')
        .delete()
        .eq('book_id', id)

        if(sellError){
            alert('book delete error')
            console.error(error);
            setLoadingAD(false);
            return
        }

        const {error} = await supabase.from('books')
        .delete()
        .eq('id', id)
        
        if(error){
            alert('book delete error')
            console.error(error);
            setLoadingAD(false);
            return
        }


        if(bookType === "physical"){
            const filename = imagetag.split('/').pop();
    
            const { data, error } = await supabase.storage
            .from('images')
            .remove(['books' + filename]);

            if (error) {
                console.error(error);
                alert('Error deleting book images' + error.message);
                setLoadingAD(false);
                return;
            }
        }else{
            const filename = imagetag.split('/').pop();

            const { data:imageData , error:errorImage } = await supabase.storage
            .from('images')
            .remove(['ebooks/' + filename]);

            if (errorImage) {
                console.error(errorImage);
                alert('Error deleting ebook Image' + errorImage.message);
                setLoadingAD(false);
                return;
            }

            const { data, error } = await supabase.storage
            .from('images')
            .remove(['ebooks/' + file]);

            if (error) {
                console.error(error);
                alert('Error deleting ebook Image' + error.message);
                setLoadingAD(false);
                return;
            }
        }
        alert('Delete Successful')
        setLoadingAD(false);
    }

    const Decline = async (user, type) => {
        try {
            setLoadingAD(true);
            console.log("loading",loadingAD)
            const bookType = type ? 'physical' : 'e-book';
            
            const { data: books, error: booksError } = await supabase // fetch first the ID to delete equivalents in books
                .from('books')                                           // and books sell
                .select('id, imagetag, file')
                .eq('account_name', user)
                .eq('isApprove', false)
                .eq('book_type', bookType);
            
            console.log("books", books);
            console.log("loading2",loadingAD)
            if (booksError) {
                throw booksError;
            }

            if(bookType === 'e-book'){

                for(const book of books){

                    const filename = book.imagetag.split('/').pop();
                    
                    const { data:imageData , error:errorImage } = await supabase.storage
                    .from('images')
                    .remove(['ebooks/' + filename]);
                    
                    if (errorImage) {
                        console.error(errorImage);
                        alert('Error deleting ebook Image' + errorImage.message);
                        setLoadingAD(false);
                        return;
                    }else{
                        console.log("images remove", imageData)
                        console.log("imagetag", filename)
                    }
                    
                    const { data, error } = await supabase.storage
                    .from('images')
                    .remove(['ebooks/' + book.file]);
    
                    if (error) {
                        console.error(error);
                        alert('Error deleting pdfFiles: ' + error.message);
                        setLoadingAD(false);
                        return;
                    }else{
                        console.log("pdf remove", data)
                        console.log("pdffile", book.file);
                    }
                
                }
            }
            else if(bookType === 'physical'){

                for(const book of books){
                    
                    const filename = book.imagetag.split('/').pop();
    
                    const { data, error } = await supabase.storage
                    .from('images')
                    .remove(['books' + filename]);
    
                    if (error) {
                        console.error(error);
                        alert('Error deleting book images' + error.message);
                        setLoadingAD(false);
                        return;
                    }
                }
            }
            
    
            const bookIds = books.map(book => book.id);
    
            if (bookIds.length === 0) {
                alert("No books found to delete");
                setLoadingAD(false);
                return;
            }
    
            const { error: booksSellError } = await supabase
                .from('books_sell')
                .delete()
                .in('book_id', bookIds);
    
            if (booksSellError) {
                throw booksSellError;
            }
    
            const { error: booksDeleteError } = await supabase
                .from('books')
                .delete()
                .in('id', bookIds);
    
            if (booksDeleteError) {
                throw booksDeleteError;
            }
            setLoadingAD(false);
            alert("Books and related entries successfully deleted");
        } 
        catch (error) {
            console.log(error);
            alert("Error deleting records");
            setLoadingAD(false);
        }
    }

    return { Approve, Decline, loadingAD, SingleDecline, UpdateUser};
}