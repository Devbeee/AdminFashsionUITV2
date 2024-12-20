import { FaGear, FaRegUser } from 'react-icons/fa6'
import { IoHomeOutline, IoSearch, IoCreateOutline  } from 'react-icons/io5'
import { MdMenu, MdOutlineWatchLater, MdOutlineLibraryAdd, MdOutlineProductionQuantityLimits } from 'react-icons/md'
import { RxSlash } from 'react-icons/rx'
import { FaPlus, FaRegTrashAlt, FaUser, FaFilter } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaSortAmountDown } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import { IoMdClose, IoIosList } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiLogOut } from 'react-icons/fi'
import { CiViewList } from "react-icons/ci";

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
  sort: <FaSortAmountDown />,
  close: <IoIosClose />,
  addProduct: <MdOutlineLibraryAdd size={20} color="white"/>,
  searchProduct: <LuSearch size={20} color="gray" className="pb-1"/>,
  closePopup: <IoMdClose size={25} color="red"/>,
  list: <IoIosList size={20} color="black"/>,
  deleteProduct: <RiDeleteBin6Line color='red'/>,
  filter: <FaFilter color='gray'/>,
  logout: <FiLogOut />,
  product: <MdOutlineProductionQuantityLimits/>,
  create: <IoCreateOutline />,
  blogList: <CiViewList />,
}
