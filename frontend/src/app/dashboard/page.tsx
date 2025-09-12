"use client"

import { useMe } from "@/hooks/useAuth"
import { useLogout } from "@/hooks/useAuth"

export default function Dashboard() {

    const { data, isLoading, isError } = useMe()


    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error Loading Data</div>


    return (
        <div>
            <h1>Welcome {`${data?.first_name} ${data?.last_name}` || "User"}</h1>
            <button onClick={useLogout}>Logout</button>
        </div>
    )
}