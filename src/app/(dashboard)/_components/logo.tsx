import Image from "next/image";

type Props = {};

const Logo = (props: Props) => {
    return (
        <div>
            <Image height={130} width={130} alt="logo" src="/logo.svg" />
        </div>
    );
};

export default Logo;
