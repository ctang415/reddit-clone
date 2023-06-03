import React, { useEffect, useState } from "react";
import parse from 'html-react-parser';
import Up from "../Assets/up.png"
import Upvoted from "../Assets/upvoted.png"
import Down from "../Assets/down.png"
import Downvoted from "../Assets/downvoted.png"
import Comment from "../Assets/comment.png"
import Share from "../Assets/share.png"
import Save from "../Assets/save.png"
import Discover from "../Assets/discover.png"
import Avatar from "../Assets/avatar.png"
import CommunityIcon from "../Assets/communityicon.png"
import { auth, db } from "../firebase-config";
import { Link, useLocation, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Post = ( {firebaseCommunityData, setFirebaseCommunityData, createNewPost, isLoggedIn, communityData, allJoinedPosts, 
    isEmpty, setAllJoinedPosts, setIsEmpty, setCommunityData, setUserData, isMobile }) => {
    const [ post, setPost ] = useState([])
    const [ allPosts, setAllPosts] = useState([])
    const [ deleted, setDeleted ] = useState('[deleted]')
    const [ currentUser, setCurrentUser ] = useState('')
    const params = useParams()
    const user = auth.currentUser
    const location = useLocation()

    const getJoinedPosts = async () => {
        setAllJoinedPosts([])
        const docRef = doc(db, "users", user.displayName)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        if (data.joined.length !== 0) {
            let joinedArray = [data.joined]
            joinedArray.map( async item => {
                item.map( async x => {
                    const docRef = doc(db, 'communities', x.toString() )
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data() 
                    setAllJoinedPosts(prev => [...prev, data.posts ])
                    setIsEmpty(false)
                })
            })
        } else {
            setAllJoinedPosts([])
            setIsEmpty(true) 
        }
    }

    const handleVote = (e) => {
        if (user) {
            if (e.target.alt === "Up arrow") {
                const updateVote = async () => {
                    const docRef = doc(db, "communities", params.id)
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    let array;
                    let poster;
                    const getPost = async () => {
                        const post = data.posts.map(x => {
                            if ( x.id === e.target.id ) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true ) {
                                    poster = x.author
                                    const updatedVoter = x.voters.map(y => {
                                        if (y.username === currentUser && y.vote === "downvote") {
                                            y.vote = 'upvote'
                                            x.votes += 1
                                            return y
                                        } else {
                                            return y
                                        }
                                    })
                                    return x
                                } else {
                                poster = x.author
                                x.voters = [...x.voters, { username: user.displayName, vote: 'upvote' } ]
                                x.votes += 1
                                return x
                                }
                            }
                            return x
                        }
                        )
                        array = post
                    }
                    getPost()
                    await updateDoc(docRef, { posts: array } )
     
                    const updateAuthor = async () => {
                        const userRef = doc(db, "users", poster)
                        const userSnap = await getDoc(userRef)
                        const userData = userSnap.data()
                        const myPost = userData.posts.map( x => {
                            if (x.id === e.target.id) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true) {
                                        poster = x.author
                                        const updatedVoter = x.voters.map(y => {
                                            if (y.username === currentUser && y.vote === "downvote") {
                                                y.vote = 'upvote'
                                                x.votes += 1
                                                const updateKarma = async () => {
                                                    const userRef = doc(db, "users", poster)
                                                    const userSnap = await getDoc(userRef)
                                                    const userData = userSnap.data()
                                                    await updateDoc(userRef, {karma: userData.karma + 1 } )
                                                    if (poster === currentUser) {
                                                        const updateUser = async () => {
                                                        const docRef = doc(db, "users", user.displayName)
                                                        const docSnap = await getDoc(docRef)
                                                        const data = docSnap.data()
                                                        setUserData([data]) 
                                                        }
                                                        updateUser()
                                                    }
                                                }
                                                updateKarma()
                                                return y
                                            } else {
                                                return y
                                            }
                                        })
                                        return x
                                } else {
                                    poster = x.author
                                    x.voters = [...x.voters, { username: user.displayName, vote: 'upvote' } ]
                                    x.votes += 1
                                    const updateKarma = async () => {
                                        const userRef = doc(db, "users", poster)
                                        const userSnap = await getDoc(userRef)
                                        const userData = userSnap.data()
                                        await updateDoc(userRef, {karma: userData.karma + 1 } )
                                        if (poster === currentUser) {
                                            const updateUser = async () => {
                                            const docRef = doc(db, "users", user.displayName)
                                            const docSnap = await getDoc(docRef)
                                            const data = docSnap.data()
                                            setUserData([data]) 
                                            }
                                            updateUser()
                                        }
                                    }
                                    updateKarma()
                                    return x
                                }
                            }
                            return x
                        })
                        await updateDoc(userRef, { posts: myPost })
                    }
                    updateAuthor()
                }
                updateVote().then( async () => {
                    const docRef = doc(db, "communities", params.id)
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    setPost([])
                    setFirebaseCommunityData([data])
                })
            } else if (e.target.alt === "Down arrow") {
                console.log('down')
                const updateVote = async () => {
                    const docRef = doc(db, "communities", params.id)
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    let array;
                    let poster;
                    const getPost = () => {
                        const post = data.posts.map(x => {
                            if ( x.id === e.target.id ) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true) {
                                    poster = x.author
                                    const updatedVoter = x.voters.map(y => {
                                        if (y.username === currentUser && y.vote === "upvote") {
                                            y.vote = 'downvote'
                                            x.votes -= 1
                                            return y
                                        } else {
                                            return y
                                        }
                                    })
                                    return x
                                } else {
                                    poster = x.author
                                    x.voters = [...x.voters, { username: user.displayName, vote: 'downvote' } ]
                                    x.votes -= 1
                                    return x
                                }
                        }
                        return x
                        })
                        array = post
                    }
                    getPost()
                    await updateDoc(docRef, {posts: array } )
                    console.log(array)
                    const updateAuthor = async () => {
                        const userRef = doc(db, "users", poster)
                        const userSnap = await getDoc(userRef)
                        const userData = userSnap.data()
                        const myPost = userData.posts.map( x => {
                            if (x.id === e.target.id) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true) {
                                    poster = x.author
                                    const updatedVoter = x.voters.map(y => {
                                        if (y.username === currentUser && y.vote === "upvote") {
                                            y.vote = 'downvote'
                                            x.votes -= 1
                                            const updateKarma = async () => {
                                                const userRef = doc(db, "users", poster)
                                                const userSnap = await getDoc(userRef)
                                                const userData = userSnap.data()
                                                await updateDoc(userRef, {karma: userData.karma - 1 } )
                                                if (poster === currentUser) {
                                                    const updateUser = async () => {
                                                    const docRef = doc(db, "users", user.displayName)
                                                    const docSnap = await getDoc(docRef)
                                                    const data = docSnap.data()
                                                    setUserData([data]) 
                                                    }
                                                    updateUser()
                                                }
                                            }
                                            updateKarma()
                                            return y
                                        } 
                                        else {
                                            return y
                                        }
                                    })
                                    return x
                                } else {
                                    poster = x.author
                                    x.voters = [...x.voters, { username: user.displayName, vote: 'downvote' } ]
                                    x.votes -= 1
                                    const updateKarma = async () => {
                                        const userRef = doc(db, "users", poster)
                                        const userSnap = await getDoc(userRef)
                                        const userData = userSnap.data()
                                        await updateDoc(userRef, {karma: userData.karma - 1 } )
                                        if (poster === currentUser) {
                                            const updateUser = async () => {
                                            const docRef = doc(db, "users", user.displayName)
                                            const docSnap = await getDoc(docRef)
                                            const data = docSnap.data()
                                            setUserData([data]) 
                                            }
                                            updateUser()
                                        }
                                    }
                                    updateKarma()
                                return x
                            }
                        }
                        return x
                        })
                        await updateDoc(userRef, { posts: myPost })
                    }
                    updateAuthor()
                }
                updateVote().then( async () => {
                    const docRef = doc(db, "communities", params.id)
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    setPost([])
                    setFirebaseCommunityData([data])
                })
            }
        }
    }

    const handleVoteLoggedIn = (e) => {
        if (user) {
            if (e.target.alt === "Up arrow") {
                const updateVote = async () => {
                    const docRef = doc(db, "communities", e.target.className)
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    let array;
                    let poster;
                    const getPost = async () => {
                        const post = data.posts.map(x => {
                            if ( x.id === e.target.id ) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true ) {
                                    poster = x.author
                                    const updatedVoter = x.voters.map(y => {
                                        if (y.username === currentUser && y.vote === "downvote") {
                                            y.vote = 'upvote'
                                            x.votes += 1
                                            return y
                                        } else {
                                            return y
                                        }
                                    })
                                    return x
                                } else {
                                poster = x.author
                                x.voters = [...x.voters, { username: user.displayName, vote: 'upvote' } ]
                                x.votes += 1
                                return x
                                }
                            }
                            return x
                        }
                        )
                        array = post
                    }
                    getPost()
                    await updateDoc(docRef, { posts: array } )
     
                    const updateAuthor = async () => {
                        const userRef = doc(db, "users", poster)
                        const userSnap = await getDoc(userRef)
                        const userData = userSnap.data()
                        const myPost = userData.posts.map( x => {
                            if (x.id === e.target.id) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true) {
                                        poster = x.author
                                        const updatedVoter = x.voters.map(y => {
                                            if (y.username === currentUser && y.vote === "downvote") {
                                                y.vote = 'upvote'
                                                x.votes += 1
                                                const updateKarma = async () => {
                                                    const userRef = doc(db, "users", poster)
                                                    const userSnap = await getDoc(userRef)
                                                    const userData = userSnap.data()
                                                    await updateDoc(userRef, {karma: userData.karma + 1 } )
                                                    if (poster === currentUser) {
                                                        const updateUser = async () => {
                                                        const docRef = doc(db, "users", user.displayName)
                                                        const docSnap = await getDoc(docRef)
                                                        const data = docSnap.data()
                                                        setUserData([data]) 
                                                        }
                                                        updateUser()
                                                        }
                                                    }
                                                    updateKarma()
                                                return y
                                            } else {
                                                return y
                                            }
                                        })
                                        return x
                                } else {
                                    poster = x.author
                                    x.voters = [...x.voters, { username: user.displayName, vote: 'upvote' } ]
                                    x.votes += 1
                                    const updateKarma = async () => {
                                        const userRef = doc(db, "users", poster)
                                        const userSnap = await getDoc(userRef)
                                        const userData = userSnap.data()
                                        await updateDoc(userRef, {karma: userData.karma + 1 } )
                                        if (poster === currentUser) {
                                            const updateUser = async () => {
                                            const docRef = doc(db, "users", user.displayName)
                                            const docSnap = await getDoc(docRef)
                                            const data = docSnap.data()
                                            setUserData([data]) 
                                            }
                                            updateUser()
                                            }
                                        }
                                        updateKarma()
                                    return x
                                }
                            }
                            return x
                        })
                        await updateDoc(userRef, { posts: myPost })
                    }
                    updateAuthor()
                }
                updateVote().then( () => {
                    getJoinedPosts()
                })
            } else if (e.target.alt === "Down arrow") {
                console.log('down')
                const updateVote = async () => {
                    const docRef = doc(db, "communities", e.target.className)
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    let array;
                    let poster;
                    const getPost = () => {
                        const post = data.posts.map(x => {
                            if ( x.id === e.target.id ) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true) {
                                    poster = x.author
                                    const updatedVoter = x.voters.map(y => {
                                        if (y.username === currentUser && y.vote === "upvote") {
                                            y.vote = 'downvote'
                                            x.votes -= 1
                                            return y
                                        } else {
                                            return y
                                        }
                                    })
                                    return x
                                } else {
                                    poster = x.author
                                    x.voters = [...x.voters, { username: user.displayName, vote: 'downvote' } ]
                                    x.votes -= 1
                                    return x
                                }
                        }
                        return x
                        })
                        array = post
                    }
                    getPost()
                    await updateDoc(docRef, {posts: array } )
                    console.log(array)
                    const updateAuthor = async () => {
                        const userRef = doc(db, "users", poster)
                        const userSnap = await getDoc(userRef)
                        const userData = userSnap.data()
                        const myPost = userData.posts.map( x => {
                            if (x.id === e.target.id) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true) {
                                    poster = x.author
                                    const updatedVoter = x.voters.map(y => {
                                        if (y.username === currentUser && y.vote === "upvote") {
                                            y.vote = 'downvote'
                                            x.votes -= 1
                                            const updateKarma = async () => {
                                                const userRef = doc(db, "users", poster)
                                                const userSnap = await getDoc(userRef)
                                                const userData = userSnap.data()
                                                await updateDoc(userRef, {karma: userData.karma - 1 } )
                                                if (poster === currentUser) {
                                                    const updateUser = async () => {
                                                    const docRef = doc(db, "users", user.displayName)
                                                    const docSnap = await getDoc(docRef)
                                                    const data = docSnap.data()
                                                    setUserData([data]) 
                                                    }
                                                    updateUser()
                                                }
                                                }
                                                updateKarma()
                                            return y
                                        } 
                                        else {
                                            return y
                                        }
                                    })
                                    return x
                                } else {
                                    poster = x.author
                                    x.voters = [...x.voters, { username: user.displayName, vote: 'downvote' } ]
                                    x.votes -= 1
                                    const updateKarma = async () => {
                                        const userRef = doc(db, "users", poster)
                                        const userSnap = await getDoc(userRef)
                                        const userData = userSnap.data()
                                        await updateDoc(userRef, {karma: userData.karma - 1 } )
                                        if (poster === currentUser) {
                                            const updateUser = async () => {
                                            const docRef = doc(db, "users", user.displayName)
                                            const docSnap = await getDoc(docRef)
                                            const data = docSnap.data()
                                            setUserData([data]) 
                                            }
                                            updateUser()
                                        }
                                        }
                                        updateKarma()
                                return x
                            }
                        }
                        return x
                        })
                        await updateDoc(userRef, { posts: myPost })
                    }
                    updateAuthor()
                }
                updateVote().then(() => {
                    getJoinedPosts()
                })
            }
        }
    }

    useEffect(() => {
        if (location.pathname.indexOf('/f/' === 0)) {
            firebaseCommunityData.map((data) => {
                data.posts.map(post => setPost(prev => [...prev, post])) 
            })
        }
    }, [firebaseCommunityData])

    useEffect(() => {
        if (location.pathname === "/" && !isLoggedIn) {
            communityData.map((data) => {
                data.posts.map(post => setAllPosts(prev => [...prev, post])) 
            })
        }
    }, [communityData])

    useEffect(() => {
        if (location.pathname === '/') {
            if (user) {
                getJoinedPosts()
            }
        }
    }, [user])

    useEffect(() => {
        if (user) {
            setCurrentUser((user.displayName))
        }
    }, [user])

    useEffect(() => {
        console.log(post)
        console.log(allJoinedPosts)
        console.log(allJoinedPosts.map(x => x.map(y=> y.voters.findIndex(z=> z.username === currentUser)))) 
    }, [])


    if (isMobile) {
        if (location.pathname === '/' && isLoggedIn && allJoinedPosts.length === 0 ) {
            return (
              <div className="empty-post-logged-in">
                    <div className="empty-post-discover">
                        <img src={Discover} alt="Snoo avatar looking through telescope"/>
                        <p>Freddit gets better when you join communities, so find some that you'll love!</p>
                        <button className="empty-post-discover-add">BROWSE POPULAR COMMUNITIES</button>
                    </div>
                </div>
            )
        } else if (location.pathname === '/' && isLoggedIn ) {
            return (
                allJoinedPosts.map((x) => {
                    return (
                        x.map((post) => {
                            return (
                            <div className="post" key={post.id}>
                            <div className="post-left">
                            <div className="post-votes-joined">
                                <img src={ ( (post.voters[post.voters.findIndex(x=> x.username === currentUser)] ) && post.voters[post.voters.findIndex(voter => voter.username === currentUser)].vote === ("upvote")) ? Upvoted : Up } alt="Up arrow" className={post.community} id={post.id} onClick={handleVoteLoggedIn}></img>
                                        {post.votes}
                                    <img src={ ( (post.voters[post.voters.findIndex(x=> x.username === currentUser)] ) && post.voters[post.voters.findIndex(voter => voter.username === currentUser)].vote === ("downvote")) ? Downvoted : Down} alt="Down arrow" className={post.community} id={post.id} onClick={handleVoteLoggedIn}></img>
                                </div>
                            </div>
                            <div className="post-right">
                                <div className="post-pinned-author">
                                <div className="post-all-community">
                                                <Link to={`f/${post.community}`}>
                                                    f/{`${post.community}`} 
                                                </Link>
                                            </div>
                                            *
                                    Posted by 
                                   <div className="post-all-community-author">
                                    <Link to={ deleted === post.author ? null : `/user/${post.author}`}>u/{post.author}</Link>
                                    </div>
                                </div>
                                <h3>
                                    <Link to={`/f/${post.community}/comments/${post.id}`}>{post.title}</Link>
                                </h3> 
                                <div className="post-media-true">
                                <Link to={`/f/${post.community}/comments/${post.id}`}>
                                    {parse(post.content.html)}
                                 </Link>
                                </div>
                                <ul>
                                <li>
                                <Link to={`f/${post.community}/comments/${post.id}`}><img src={Comment} alt="Comment bubble"/> {post.comments.length} Comments </Link></li>
                                    <li><img src={Share} alt="Share button" /> Share</li>
                                    <li><img src={Save} alt="Save button" /> Save</li>
                                    <li>...</li>
                                </ul>
                            </div>
                        </div>
                        )
                    })
                    )
                })
            ) 
            } else if (location.pathname === '/' && !isLoggedIn && allPosts.length === 0) {
                return (
                    <div className="empty-post">
                        <div>
                            <h4>There are no posts available</h4>
                            <p>Be the first to till this fertile land.</p>
                            <button className="empty-post-add" onClick={createNewPost}> Add a post </button>
                        </div>
                    </div>
                )
            } else if (location.pathname === '/' && !isLoggedIn && allPosts.length !== 0) {
                return (
                    allPosts.map((post) => {
                        return ( 
                            <div className="post" key={post.id}>
                                <div className="post-right">
                                    <div className="post-pinned-author">
                                        <div className="post-all-community">
                                        <img src={CommunityIcon} alt="Community Icon"></img>
                                            <Link to={`f/${post.community}`}>
                                                f/{`${post.community}`} 
                                            </Link>
                                        </div>
                                        </div>
                                    <div className="post-mobile">
                                        <Link to={`f/${post.community}/comments/${post.id}`}>
                                            {post.title}
                                        </Link>
                                            {parse(`${post.content.html}`)}
                                    </div>
                                    <ul>
                                        <li>
                                            <img src={ Up } alt="Up arrow"></img>
                                                {post.votes}
                                            <img src={ Down} alt="Down arrow"></img>
                                        </li>
                                        <li>
                                            <Link to={`f/${post.community}/comments/${post.id}`}>
                                                <img src={Comment} alt="Comment bubble"/> {post.comments.length} 
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )
                    })
                )
            } else if (location.pathname.indexOf('/f/') === 0 && post.length === 0 ) {
                return (
                    <div className="empty-post">
                        <div>
                            <h4>There are no posts in this subfreddit</h4>
                            <p>Be the first to till this fertile land.</p>
                            <button className="empty-post-add" onClick={ isLoggedIn ? createNewPost : null}> Add a post </button>
                        </div>
                    </div>
                )
            }   else if (location.pathname.indexOf('/f/') === 0 && post.length !== 0 ) {
                    return (
                        post.map((post) => {
                            return ( 
                                    <div className="post" key={post.id}>
                                    <div className="post-right">    
                                        <div className="post-pinned-author">
                                            <img src={Avatar} alt="Avatar icon"/>
                                            <Link to={ deleted === post.author ? null : `../user/${post.author}`}>{post.author}</Link>
                                        </div>
                                        <div className="post-mobile">
                                        <Link to={`./comments/${post.id}`}>
                                            {post.title}
                                            </Link>
                                            {parse(post.content.html)}
                                        </div>
                                        <ul>
                                            <li>
                                            <img src={ ( isLoggedIn &&  (post.voters[post.voters.findIndex(x=> x.username === currentUser)] ) && post.voters[post.voters.findIndex(x=> x.username === currentUser)].vote === ("upvote")) ? Upvoted : Up } alt="Up arrow" id={post.id} onClick={handleVote}></img>
                                                    {post.votes} 
                                                <img src={  ( isLoggedIn &&  (post.voters[post.voters.findIndex(x=> x.username === currentUser)] ) && post.voters[post.voters.findIndex(x=> x.username === currentUser)].vote === ("downvote")) ? Downvoted : Down} alt="Down arrow" id={post.id} onClick={handleVote}></img>
                                            </li>
                                            <li>
                                                <Link to={`./comments/${post.id}`}>
                                                    <img src={Comment} alt="Comment bubble"/> {post.comments.length} 
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                           
                                </div>
                            )
                        })
                    )
            }
    } else {

if (location.pathname === '/' && isLoggedIn && allJoinedPosts.length === 0 ) {
    return (
      <div className="empty-post-logged-in">
            <div className="empty-post-discover">
                <img src={Discover} alt="Snoo avatar looking through telescope"/>
                <p>Freddit gets better when you join communities, so find some that you'll love!</p>
                <button className="empty-post-discover-add">BROWSE POPULAR COMMUNITIES</button>
            </div>
        </div>
    )
} else if (location.pathname === '/' && isLoggedIn ) {
    return (
        allJoinedPosts.map((x) => {
            return (
                x.map((post) => {
                    return (
                    <div className="post" key={post.id}>
                    <div className="post-left">
                    <div className="post-votes-joined">
                        <img src={ ( (post.voters[post.voters.findIndex(x=> x.username === currentUser)] ) && post.voters[post.voters.findIndex(voter => voter.username === currentUser)].vote === ("upvote")) ? Upvoted : Up } alt="Up arrow" className={post.community} id={post.id} onClick={handleVoteLoggedIn}></img>
                                {post.votes}
                            <img src={ ( (post.voters[post.voters.findIndex(x=> x.username === currentUser)] ) && post.voters[post.voters.findIndex(voter => voter.username === currentUser)].vote === ("downvote")) ? Downvoted : Down} alt="Down arrow" className={post.community} id={post.id} onClick={handleVoteLoggedIn}></img>
                        </div>
                    </div>
                    <div className="post-right">
                        <div className="post-pinned-author">
                        <div className="post-all-community">
                                        <Link to={`f/${post.community}`}>
                                            f/{`${post.community}`} 
                                        </Link>
                                    </div>
                                    *
                            Posted by 
                           <div className="post-all-community-author">
                            <Link to={ deleted === post.author ? null : `/user/${post.author}`}>u/{post.author}</Link>
                            </div>
                        </div>
                        <h3>
                            <Link to={`/f/${post.community}/comments/${post.id}`}>{post.title}</Link>
                        </h3> 
                        <div className="post-media-true">
                        <Link to={`/f/${post.community}/comments/${post.id}`}>
                            {parse(post.content.html)}
                         </Link>
                        </div>
                        <ul>
                        <li>
                        <Link to={`f/${post.community}/comments/${post.id}`}><img src={Comment} alt="Comment bubble"/> {post.comments.length} Comments </Link></li>
                            <li><img src={Share} alt="Share button" /> Share</li>
                            <li><img src={Save} alt="Save button" /> Save</li>
                            <li>...</li>
                        </ul>
                    </div>
                </div>
                )
            })
            )
        })
    ) 
    } else if (location.pathname === '/' && !isLoggedIn && allPosts.length === 0) {
        return (
            <div className="empty-post">
                <div>
                    <h4>There are no posts available</h4>
                    <p>Be the first to till this fertile land.</p>
                    <button className="empty-post-add" onClick={createNewPost}> Add a post </button>
                </div>
            </div>
        )
    } else if (location.pathname === '/' && !isLoggedIn && allPosts.length !== 0) {
        return (
            allPosts.map((post) => {
                return ( 
                    <div className="post" key={post.id}>
                        <div className="post-left">
                            <div className="post-votes-all">
                                <img src={ Up } alt="Up arrow"></img>
                                    {post.votes}
                                <img src={ Down} alt="Down arrow"></img>
                            </div>
                        </div>
                        <div className="post-right">
                            <div className="post-pinned-author">
                                <div className="post-all-community">
                                    <Link to={`f/${post.community}`}>
                                        f/{`${post.community}`} 
                                    </Link>
                                </div>
                                    *
                                    Posted by 
                                    <Link to={ deleted === post.author ? null : `user/${post.author}`} > 
                                        <div className="post-all-author">u/{post.author}</div>
                                    </Link>
                                </div>
                            <h3>
                                <Link to={`f/${post.community}/comments/${post.id}`}>
                                    {post.title}
                                </Link>
                            </h3>
                            <div className="post-media-true">
                                <Link to={`f/${post.community}/comments/${post.id}`}>
                                    {parse(post.content.html)}
                                </Link>
                            </div>
                            <ul>
                                <li>
                            <Link to={`f/${post.community}/comments/${post.id}`}><img src={Comment} alt="Comment bubble"/> {post.comments.length} Comments </Link></li>
                                <li><img src={Share} alt="Share button" /> Share</li>
                                <li><img src={Save} alt="Save button" /> Save</li>
                                <li>...</li>
                            </ul>
                        </div>
                    </div>
                )
            })
        )
    } else if (location.pathname.indexOf('/f/') === 0 && post.length === 0 ) {
        return (
            <div className="empty-post">
                <div>
                    <h4>There are no posts in this subfreddit</h4>
                    <p>Be the first to till this fertile land.</p>
                    <button className="empty-post-add" onClick={ isLoggedIn ? createNewPost : null}> Add a post </button>
                </div>
            </div>
        )
    }   else if (location.pathname.indexOf('/f/') === 0 && post.length !== 0 ) {
            return (
                post.map((post) => {
                    return ( 
                            <div className="post" key={post.id}>
                            <div className="post-left">
                             <div className="post-votes">
                                   <div>
                                        <img src={ ( isLoggedIn &&  (post.voters[post.voters.findIndex(x=> x.username === currentUser)] ) && post.voters[post.voters.findIndex(x=> x.username === currentUser)].vote === ("upvote")) ? Upvoted : Up } alt="Up arrow" id={post.id} onClick={handleVote}></img>
                                            {post.votes} 
                                        <img src={  ( isLoggedIn &&  (post.voters[post.voters.findIndex(x=> x.username === currentUser)] ) && post.voters[post.voters.findIndex(x=> x.username === currentUser)].vote === ("downvote")) ? Downvoted : Down} alt="Down arrow" id={post.id} onClick={handleVote}></img>
                                    </div>
                                </div>
                            </div>
                            <div className="post-right">    
                                <div className="post-pinned-author">
                                    Posted by <Link to={ deleted === post.author ? null : `../user/${post.author}`}>u/{post.author}</Link>
                                </div>
                                <h3>
                                <Link to={`./comments/${post.id}`}>
                                    {post.title}
                                    </Link>
                                </h3>
                                <div className="post-media-true">
                                <Link to={`./comments/${post.id}`}> 
                                    {parse(post.content.html)}
                                </Link>
                                </div>
                                <ul>
                                <li>
                                <Link to={`./comments/${post.id}`}><img src={Comment} alt="Comment bubble"/> {post.comments.length} Comments </Link></li>
                                    <li><img src={Share} alt="Share button" /> Share</li>
                                    <li><img src={Save} alt="Save button" /> Save</li>
                                    <li>...</li>
                                </ul>
                            </div>
                   
                        </div>
                    )
                })
            )
    }
    }
}

export default Post