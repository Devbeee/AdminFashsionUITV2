import { FaGear, FaRegUser } from 'react-icons/fa6'
import { IoHomeOutline, IoSearch } from 'react-icons/io5'
import { MdMenu, MdOutlineWatchLater } from 'react-icons/md'
import { RxSlash } from 'react-icons/rx'
import { FaPlus, FaRegTrashAlt, FaUser } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { LuSearch } from "react-icons/lu";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoIosList } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
const dropdownIcon = `url('data:image/svg+xml;utf8,<svg fill="gray" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`;

export const icons = {
  menu: <MdMenu />,
  slash: <RxSlash />,
  home: <IoHomeOutline />,
  search: <IoSearch />,
  setting: <FaGear />,
  user: <FaRegUser />,
  add: <FaPlus />,
  delete: <FaRegTrashAlt />,
  danger: <CgDanger size={25} />,
  update: <HiOutlinePencilSquare />,
  faUser: <FaUser />,
  watch: <MdOutlineWatchLater />,
  addProduct: <MdOutlineLibraryAdd size={20} color="white"/>,
  searchProduct: <LuSearch size={20} color="gray" className="pb-1"/>,
  closePopup: <IoMdClose size={25} color="red"/>,
  list: <IoIosList size={20} color="black"/>,
  deleteProduct: <RiDeleteBin6Line color='red'/>,
  dropdownIcon: dropdownIcon
}