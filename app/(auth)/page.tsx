import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Home = () => {
  return (
    <div>
      <Link href={"/sign-up"}>
        <Button>SignUp</Button>
      </Link>
      <Link href={"/sign-in"}>
        <Button>SignIn</Button>
      </Link>
    </div>
  );
}

export default Home
