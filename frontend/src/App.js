import { Route, Routes} from 'react-router-dom'
import MainDashboard from './Dashboard/MainDashboard'
import UserList from './Users/UserListing'
import Layout from './common/Layout'
import LoginScreen from './LoginPage/LoginPage'
import LandingScreen from './LandingScreen/landingScreen'

function App() {
  return (
    <>
              <Routes>        
                  <Route exact path='/' element={<LoginScreen/>}/>
                  <Route element={<Layout/>}>
                    <Route  path ='/landingScreen' element={<LandingScreen/>}/>
                    <Route  path ='/dashboard' element={<MainDashboard/>}/>
                    <Route path='/userList' element={<UserList/>}/>
                  </Route>                                                      
              </Routes>
              </>
  );
}

export default App;
