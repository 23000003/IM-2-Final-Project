import { useEffect, useState } from "react";
import supabase from "../Supabase";

export default function UserAccountData(account, loc){

    const [accountData, setAccountData] = useState([]);
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        setLoading(true);
        const fetch = async () =>{
            try{
                const {data, error} = await supabase.from('Books')
                .select()
                .eq('account_name', account);
    
                if(error){
                    alert("Error Fetching User Data");
                    console.log(error);
                }else{
                    setAccountData(data);
                    setLoading(false);
                }
            }
            catch(error){
                alert("error catching data");
                console.error(error.message);
            }
        }
        fetch();

        const fetchProfile = async () =>{
            try{
                const {data, error} = await supabase.from('Accounts')
                .select('profile')
                .eq('location', loc)
                .single();

                if(error){
                    alert("Error Fetching Profile");
                    console.log(error);
                }else{
                    setProfile(data);
                }
            }
            catch(error){
                alert("error catch");
                console.error(error.message);
            }
        }
        fetchProfile();
    },[account])
    

    return {accountData, profile, loading};
}