import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { useRouter } from 'next/navigation'; // Adjust based on your directory structure
import Image from 'next/image';
import Button from './Button';

interface UserPopoverProps {
    userName: string;
    userEmail: string;
    onLogout: () => void;
    onWalletIntegration: () => void;
}

const UserPopover: React.FC<UserPopoverProps> = ({ userName, userEmail, onLogout, onWalletIntegration }) => {
    const router = useRouter();

    const handleLogout = () => {
        onLogout(); // Call the logout function to clear authentication state
        router.push('/'); // Redirect to the "/" page after logout
    };

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <a
                    className="inline-block cursor-pointer rounded-full shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] outline-none focus:shadow-[0_0_0_2px_white]"
                    href="#"
                    aria-label="User menu"
                >
                    <Image
                        className="block h-[45px] w-[45px] rounded-full"
                        src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
                        alt="User Avatar"
                        width={45}
                        height={45}
                    />
                </a>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    className="rounded-md bg-white p-5 shadow-lg transition-transform duration-200 ease-out transform-gpu will-change-transform scale-95 origin-top-right data-[state=open]:scale-100"
                    sideOffset={5}
                    align="end"
                >
                    <div className="flex flex-col items-center gap-[7px]">
                        <Image
                            className="block h-[60px] w-[60px] rounded-full"
                            src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
                            alt="User Avatar"
                            width={60}
                            height={60}
                        />
                        <div className="flex flex-col gap-[15px] text-center">
                            <div>
                                <div className="text-gray-900 m-0 text-[15px] font-medium leading-[1.5]">{userName}</div>
                                <div className="text-gray-500 m-0 text-[15px] leading-[1.5]">{userEmail}</div>
                            </div>
                            <div className="text-gray-900 m-0 text-[15px] leading-[1.5]">
                                Manage your profile, settings, or log out.
                            </div>
                            <div className="flex justify-center gap-[15px] mt-4">
                                <Button className="text-blue-500 hover:text-blue-700" onClick={onWalletIntegration}>Wallet</Button>
                                <Button onClick={handleLogout}>Logout</Button>
                            </div>
                        </div>
                    </div>
                    <Popover.Arrow className="fill-white" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

export default UserPopover;
