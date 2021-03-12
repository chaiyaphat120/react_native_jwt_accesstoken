import React, { useState, useEffect } from 'react'
import { View, Text, Button ,TextInput, ScrollView, SafeAreaView, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import  * as jsrsasign from 'jsrsasign'; //JWT, {KJUR}
import qs from 'qs'     //yarn add  @types/qs
// https://react-native-async-storage.github.io/async-storage/docs/usage
import axios ,{AxiosResponse}from 'axios'
interface dataUsertype {
    _id  :string,
    email:string,
    fullname:string,
    role:string,
    tel:number,
    username:string
}
interface dataUsertype2 {
    data:{
        _id  :string,
        email:string,
        fullname:string,
        role:string,
        tel:number,
        username:string
    }
}

const App: React.FC = () => {
    const [username , setUsername] = useState<string>("")
    const [password , setPassword] = useState<string>("")


    const [usernameRe , setUsernameRe] = useState<string>("")
    const [passwordRe , setPasswordRe] = useState<string>("")
    const [email , setEmail] = useState<string>("")
    const [fullname , setFullname] = useState<string>("")
    const [tel , setTel] = useState<string>("")
    const [role , setRole] = useState<string>("")

    const [dataUser , setDataUser] = useState<Partial<dataUsertype>>({})

    /*######################## login  #########################*/
    const login = async () => {
        try {
            //genarate token
            const header = { alg: 'HS256', typ: 'JWT' }
            const sHeader = JSON.stringify(header)
            const payload = {
                username,
                password
            }
            const sPayload = JSON.stringify(payload)
            const token = jsrsasign.KJUR.jws.JWS.sign('HS256', sHeader, sPayload, { utf8: '123' })
            console.log("token" ,token)
            //axios
            const response = await axios({
                method: 'POST',
                data: { token },
                // url: "http://192.168.1.150:3000/users/login",  //เปลี่ยนจาก localhost เป็นหมายเลข ip  จากการใช้ ipconfig เลือก  IPv4 Address
                url: "https://node-demo20120.herokuapp.com/users/login",  //เปลี่ยนจาก localhost เป็นหมายเลข ip  จากการใช้ ipconfig เลือก  IPv4 Address
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            console.log(response.data)
            setPassword("")
            setUsername("")
            await AsyncStorage.setItem('@access_token', response.data.access_token)
            await AsyncStorage.setItem('@user_id', response.data.userId)
        } catch (error) {
            Alert.alert(JSON.stringify(error.response.data))
        }
    }

    /*######################## register  #########################*/
    const register = async () => {
        try {
            //genarate token
            const header = { alg: 'HS256', typ: 'JWT' }
            const sHeader = JSON.stringify(header)
            const payload = {
                username: usernameRe,
                password: passwordRe,
                email: email,
                fullname,
                tel,
                role
            }
            const sPayload = JSON.stringify(payload)
            const token = jsrsasign.KJUR.jws.JWS.sign('HS256', sHeader, sPayload, { utf8: '123' })
            //axios
            const response = await axios({
                method: 'POST',
                data: { token },
                url: "https://node-demo20120.herokuapp.com/users/register",  
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            console.log(response.data)
            setUsernameRe("")
            setPasswordRe("")
            setEmail("")
            setFullname("")
            setTel("")
            setRole("")
        } catch (error) {
            Alert.alert(JSON.stringify(error.response.data))
        }
    }

    const onPress = async()=>{
        const access_token = await AsyncStorage.getItem('@access_token')
        console.log(access_token)
    }

    const FechDataUser = async()=>{
        const user_id = await AsyncStorage.getItem('@user_id')
        console.log(user_id)
        try {
            //genarate token
            const header = { alg: 'HS256', typ: 'JWT' }
            const sHeader = JSON.stringify(header)
            const sPayload = JSON.stringify(user_id)
            const token = jsrsasign.KJUR.jws.JWS.sign('HS256', sHeader, sPayload, { utf8: 'secreteKey123' })
            console.log("token register" ,token)

            //axios
            await axios.get<dataUsertype2>(`http://192.168.1.150:3000/users/${token}`).then((response)=>{
                const { _id,  email,  fullname,  role, tel,username} = response.data.data
                setDataUser({ _id,  email,  fullname,  role, tel,username})
            })
        } catch (error) {
            Alert.alert(JSON.stringify(error.message))
        }
    }

    return (
        <SafeAreaView style={{flex:1,backgroundColor:"#ddd3d3"}}>
            <View style={{width:"100%",height:180,backgroundColor:'#ffffff'}}>
                <Button onPress={FechDataUser} title="3.Show data user"/>
                {dataUser && <Text >{dataUser.username}</Text>}
                {dataUser && <Text >{dataUser.email}</Text>}
                {dataUser && <Text >{dataUser.fullname}</Text>}
                {dataUser && <Text >{dataUser.role}</Text>}
                {dataUser && <Text >{dataUser.tel}</Text>}
            </View>
            <ScrollView>
                <Text>Hello React Native JWT AND access token</Text>
                <Text>Login</Text>
                <TextInput autoCapitalize="none"  placeholder="username"  value={username} onChangeText={(e)=>setUsername(e)}/> 
                <TextInput  autoCapitalize="none"  placeholder="password"  value={password} onChangeText={(e)=>setPassword(e)}/> 
                <Button title="2.Login" onPress={login} />
                <Button title="Show Strorage" onPress={onPress}/>
                <View style={{width:50,height:50}}/>

                <Text>Register</Text>
                <TextInput autoCapitalize="none"  placeholder="username"  value={usernameRe} onChangeText={(e)=>setUsernameRe(e)}/> 
                <TextInput  autoCapitalize="none"  placeholder="password"  value={passwordRe} onChangeText={(e)=>setPasswordRe(e)}/> 
                <TextInput  autoCapitalize="none"  placeholder="email"  value={email} onChangeText={(e)=>setEmail(e)}/> 
                <TextInput  autoCapitalize="none"  placeholder="fullname"  value={fullname} onChangeText={(e)=>setFullname(e)}/> 
                <TextInput  autoCapitalize="none"  placeholder="tel"  value={tel} onChangeText={(e)=>setTel(e)}/> 
                <TextInput  autoCapitalize="none"  placeholder="role"  value={role} onChangeText={(e)=>setRole(e)}/> 
                <Button title="1.REGISTER" onPress={register} />
                <View style={{width:50,height:50}}/>

            </ScrollView>
        </SafeAreaView>
    )
}

export default App
