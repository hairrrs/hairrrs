import { useRouter } from "next/router";

export default function Profile(){
  const router = useRouter()
  const { displayName } = router.query;

  return(<>hello, {displayName}</>)
}