import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { json, User } from '../utils/api';
import { MdSearch } from 'react-icons/md';
import ProfileNavbar from '../components/ProfileNavbar';
import ProfileSwitchBar from '../components/ProfileSwitchBar';
import Bottomnavbar from '../components/Bottomnavbar';

const MyPlants: React.FC<MyPlantsProps> = props => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [user, setUser] = useState<{username:string, avatar_path:string, role: string, user_id: number}>({
        username: '',
        avatar_path: '',
        role: '',
        user_id: 0
    });

    useEffect(() => {
        (async () => {
            try {
                if (!User || User.user_id === null || User.role !== 'guest') {
                    props.history.replace('/', {msg:'You must be logged in to view this page!'});
                } else {
                    let [user] = await json('/api/users');
                    setUser(user);
                    if (props.location.state?.query.length > 0){
                        setQuery(props.location.state.query)
                    } 
                } 
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const queryButtonPress = async (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        let results = await json(`/api/plants/search?plant=${query}`)
        console.log(results);
        setResults(results);
        props.history.push('/plantresults', { query, results });
    }

    const queryKeyPress = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            let results = await json(`/api/plants/search?plant=${query}`)
            console.log(results);
            setResults(results);
            props.history.push('/plantresults', { query, results });
        }
    }

    const isEnabled = query.length > 0;

    return (
        <>
            <ProfileNavbar user={user} />

            <ProfileSwitchBar />

                <div className="container text-center col-md-6 offset-md-3 p-3 plant-search-bar">
                    <div className="input-group">
                            <input
                                className="form-control mt-4 p-2"
                                type="text"
                                placeholder="Search for a plant to add by name..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyPress={queryKeyPress}
                            />

                            <button
                                className="btn btn-lg btn-outline-primary reveal mt-4"
                                type="submit"
                                id="button-hover"
                                onClick={queryButtonPress}
                                disabled={!isEnabled}
                            >
                                    <MdSearch />
                            </button>
                    </div>

                </div>

            <Bottomnavbar />
        </>
    );
};

interface MyPlantsProps extends RouteComponentProps {  }

interface SearchResult {
    id: number,
    slug: string,
    scientific_name: string,
    common_name: string
}

export default MyPlants;