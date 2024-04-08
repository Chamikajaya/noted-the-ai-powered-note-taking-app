import React, {ReactNode} from 'react';
import Navbar from "@/components/Navbar";

interface NotesLayoutProps {
    children: ReactNode;
}

const NotesLayout: React.FC<NotesLayoutProps> = ({children}) => {
    return (
        <>
            <Navbar/>
            <main className="px-6 py-4 m-auto max-w-6xl">
                {children}
            </main>
        </>
    );
};

export default NotesLayout;