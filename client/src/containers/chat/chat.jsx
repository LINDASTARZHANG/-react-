import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem, Grid, Icon} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'

import {sendMsg, readMsg} from '../../redux/actions'
// import Icon from "antd-mobile/es/icon";

const Item = List.Item

class Chat extends Component {
  state = {
    content: '',
    isShow: false
  }
  componentWillMount() {
    const emojis = ['ð', 'ð', 'ð', 'ð', 'ð', 'ð', 'ðĪĢ', 'ð', 'ð', 'ð', 'ð', 'ð',
    'ð', 'ðĨ°', 'ð', 'ðĪĐ', 'ð', 'ð', 'âšïļ', 'ð', 'ð', 'ðĨē', 'ð', 'ð', 'ð', 'ðĪŠ', 'ðī',
    'ð·', 'ðĪŪ', 'ðĪĒ', 'ðĨĩ', 'ðĪ', 'ð', 'ð­', 'ðĐ', 'ð', 'ðĪ', 'ðĄ', 'ð', 'â ïļ', 'ðĐ', 'ðĪĄ',
    'ðđ', 'ðŧ', 'ð―', 'ðš', 'ðđ', 'ð', 'ð', 'ð', 'ð', 'âïļ', 'ðĪ', 'ðĪ', 'ð', 'ð', 'ð',
    'ð', 'ð', 'ð', 'ð', 'â', 'ð', 'ð', 'ð', 'ðĪ', 'ð', 'âïļ', 'ðŠ', 'ðĶķ', 'ð', 'ð',
    'ðĶ·', 'ð', 'ð', 'ð§', 'ðĶ', 'ðķ', 'ðĐ', 'ðĻ', 'ðââïļ', 'ðââïļ', 'âïļ', 'ð', 'ð', 'ð', 'ð']
    this.emojis = emojis.map(emoji => ({text: emoji}))
  }
  toggleShow = () => {
    const isShow = !this.state.isShow
    this.setState({isShow})
    if (isShow) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }

  componentDidMount() {
    window.scrollTo(0, document.body.scrollHeight)
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    window.scrollTo(0, document.body.scrollHeight)
  }
  componentWillUnmount() {
    const from = this.props.match.params.userId
    const to = this.props.user._id
    const targetChatId = [from, to].sort().join('_')
    const {chatMsgs} = this.props.chat
    const targetMsgs = chatMsgs.filter(msg => (msg.chat_id === targetChatId && !msg.read))
    if (targetMsgs.length > 0) {
      this.props.readMsg(from, to)
    }
  }

  handleSend = () => {
    const from = this.props.user._id
    const to = this.props.match.params.userId
    const content = this.state.content.trim()
    if (content) {
      this.props.sendMsg({from, to, content})
    }
    this.setState({
      content: '',
      isShow: false
    })

  }

  render() {
    //åūå°æ°æŪ
    const {user} = this.props
    const {users, chatMsgs} = this.props.chat
    const meId = user._id
    if (!users[meId]) {
      return null
    }
    const targetId = this.props.match.params.userId
    const chatId = [meId, targetId].sort().join('_')
    const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
    const {username, header} = users[targetId]
    const targetIcon = header ? require(`../../assets/headers/${header}.png`).default : null
    return (
      <div id='chat-page'>
        <NavBar
          className='sticky-header'
          icon={<Icon type='left'/>}
          onLeftClick={()=>this.props.history.goBack()}
        >{username}</NavBar>
        <List style={{marginTop: 50, marginBottom: 56}}>
          <QueueAnim type='left' delay={100}>
            {
              msgs.map(msg => {
                if (targetId === msg.from) {
                  return (
                    <Item thumb={targetIcon} key={msg._id}>{msg.content}</Item>
                  )
                } else {
                  return (
                    <Item className='chat-me' extra='æ' key={msg._id}>{msg.content}</Item>
                  )
                }
              })
            }
          </QueueAnim>
        </List>
        <div className='am-tab-bar'>
          <InputItem placeholder="čŊ·čūåĨ"
                     value={this.state.content}
                     onChange={val => this.setState({content: val})}
                     onFocus={()=>this.setState({isShow: false})}
                     extra={
                       <span>
                         <span onClick={this.toggleShow} style={{marginRight: 10}}>ð</span>
                         <span onClick={this.handleSend}>åé</span>
                       </span>
                     }
          />
          {this.state.isShow ? (
            <Grid data={this.emojis}
                  columnNum={8}
                  carouselMaxRow={4}
                  isCarousel={true}
                  onClick={(item) => {
                    this.setState({content: this.state.content + item.text})
                  }}
            />
          ) :null}

        </div>
      </div>
    )
  }
}
export default connect(
  state => ({user: state.user, chat: state.chat}),
  {sendMsg, readMsg}
)(Chat)
