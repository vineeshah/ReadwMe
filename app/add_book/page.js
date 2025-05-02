import prisma from "../config/db";

function AddBookPage() {
    return (
        <div>
            <input 
                type="text" 
                placeholder="Search for a book..."  
            />
        </div>
    );
}

export default AddBookPage;

