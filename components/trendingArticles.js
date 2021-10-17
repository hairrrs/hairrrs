import Image from "next/image"

export default function TrendingArticles({ limit = "18" }) {

    return (<>
        <div className="" style={{ background: '#eb004e', color: 'white', textAlign: 'center', padding: '10px' }}><strong>Trending Articles</strong></div>
        <br />
        <div className="flex flex-wrap featuredCatg_wig-body" style={{ gap: '2.5rem', padding: '0 3.9%' }}>
            <Card />
        </div>
        <br />
        <div className="flex justify-center">
            <span style={{ color: '#eb004e', padding: '10px 100px', border: '2px solid #eb004e', fontWeight: 600, borderRadius: 5 }}>see more</span>
        </div>
    </>)
}

const Card = () => {
    return (
        <div style={{ width: 300 }}>
            <div style={{ padding: '15px 25px', background: '#eb004e', gap: '1rem', height: 140 }}>
                <div className="flex items-center">
                    <div className="" style={{ borderRadius: '50%', background: '#fff', width: "43px", height: "43px" }}>
                        {// eslint-disable-next-line @next/next/no-img-element
                            <img src="/images/nutless braid.png" alt="" width="100%" height="100%" style={{ borderRadius: '50%' }} />
                        }
                    </div>
                    <div style={{ padding: '5px 10px', fontSize: '.7rem', borderRadius: 5, marginLeft: 12, background: '#fff' }}><strong>David Blane</strong></div>
                </div>
            </div>
            <div className="" style={{ padding: '10px', background: '#fff', boxShadow: 'rgb(0 0 0 / 12%) 0px 1px 7px 0px' }}>
                <div className=""><strong>Title of the article will be here all the time, always, forever?</strong></div>
                <div className="flex">
                    <div className="">
                        <p style={{ fontSize: '.8rem' }}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia sapiente excepturi ducimus rem praesentium? Suscipit...
                        </p>
                        <p style={{ fontSize: '.9rem', margin: '5px 0' }}>category <span style={{ color: '#eb004e' }}>Weavon</span></p>
                        <div className="flex" style={{ gap: '2rem' }}>
                            <div>like</div>
                            <div>dislike</div>
                            <div>chat</div>
                        </div>
                    </div>
                    <div className="flex-column" style={{ justifyContent: 'flex-end' }}>
                        <div className="" aria-hidden="true">
                            <Image src="/images/Icon awesome-share-alt.png" alt="" width="30px" height="30px" />
                        </div>
                        <div className="mt-3" aria-hidden="true">
                            <Image src="/images/Icon awesome-chevron-circlee-down.png" alt="" width="30px" height="30px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}