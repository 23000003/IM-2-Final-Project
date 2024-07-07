import '../styles/Admin.css'
import AdminPostApproval from './AdminPostApproval';

export default function AdminPanel(){

    return(
        <div className="admin-container">
            <div className="admin-background">
                <div className="Welcome">
                    <img src="https://wfiljmekszmbpzaqaxys.supabase.co/storage/v1/object/public/images/pfp.jpg?t=2024-05-29T05%3A50%3A57.482Z" alt=""/>
                    <h2>Hello Admin 1</h2>
                </div>
                <div className="Data">
                    
                    <div className="Data-Card">
                        <div style={{margin: '2em', width: '100%'}}>
                            <div className="Data-Card-Child1">                        
                                <h2 style={{fontSize: '22px'}}>Number of Books On Sale</h2>
                            </div>
                            <div className="Data-Card-Child2">
                                <h2>100</h2>
                            </div>
                        </div>
                    </div>

                    <div className="Data-Card">
                        <div style={{margin: '2em', width: '100%'}}>
                            <div className0="Data-Card-Child1">                        
                                <h2 style={{fontSize: '22px'}}>Number of Books On Sale</h2>
                            </div>
                            <div className="Data-Card-Child2">
                                <h2>100</h2>
                            </div>
                        </div>
                    </div>

                    <div className="Data-Card">
                        <div style={{margin: '2em', width: '100%'}}>
                            <div className="Data-Card-Child1">                        
                                <h2 style={{fontSize: '22px'}}>Number of Books On Sale</h2>
                            </div>
                            <div className="Data-Card-Child2">
                                <h2>100</h2>
                            </div>
                        </div>
                    </div>

                    <div className="Data-Card">
                        <div style={{margin: '2em', width: '100%'}}>
                            <div className="Data-Card-Child1">                        
                                <h2 style={{fontSize: '22px'}}>Number of Books On Sale</h2>
                            </div>
                            <div className="Data-Card-Child2">
                                <h2>100</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <AdminPostApproval/>                    
            </div>
        </div>
    );
}