
class Body extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  render() {
    const {type} = this.props;
    // 5. 查看child2是否成功获取到数值
    console.log('body got type '+type);
    // 6. 根据拿到的数值发送请求获取不同的数据
    /**
     * issue
     * 1. 页面初始化的时候发了两次请求
     * 2. 每次更改type的时候会发送很多次一模一样的请求
     * todo:
     * 1. react生命周期继续学习 (优先)
     * 2. promise对象 再去理解一下
     * 3. generator去过一遍
     */

    const list = type.map((item, key) =>
      <li key={item.id} style={{ padding: 50, backgroundColor: '#f6f6f6', margin: 5, listStyle: 'none'}}>
        <h3 style={{ textAlign: 'center' }}>#{key + 1}</h3>
        <img src={item.owner.avatar_url} width="335" height="335"></img>
        <h4 style={{ textAlign: 'center', color: 'red' }}>{item.name}</h4>
        <p><i class="fa fa-user"></i> {item.name}</p>
        <p><i class="fa fa-star"></i>{item.stargazers_count} stars</p>
        <p><i class="fa fa-code-fork"></i>{item.forks} forks</p>
        <p><i class="fa fa-warning"></i>{item.open_issues} open issues</p>
      </li>
    );

    return <main>
      <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
        {list}
      </ul>
    </main>;
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {type:'All'};
  }

  types = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

  componentDidMount(){
    this.changeType('All')
  }  

  changeType = type => {
    
    // 1. 获取到当前点击的类型
    // 2. 再一次通过api获取该类型的数据
    // 3. 把获取到的数据填充进RepoList
    /*
      parent
       | child1
       | child2
      todo: child1 <-> child2
      way:
       1. child1 -> parent (callback)
       2. parent -> child2 (props)
    */
    
    // 1. child1 获取到需要传递给parent的值
    console.log(type)
    // 2. 尝试将数组传给parent
    // 2-1. 此时传递的不再是type, 而是获取到的数据
    const baseUrl = `https://api.github.com/search/repositories?q=stars:%3E1+language:${type}&sort=stars&order=desc&type=Repositories`
    axios.get(baseUrl)
    .then(res=>{
      // 3. 回调parent为该child1准备的方法
      this.props.callback(res.data.items)
    })
    
    
    
    // this.setState({type});
    // console.log(this.state.type)
    // console.log(this.props.type)
  }


  render() {
    return <header>
      <ul >
        {this.types.map(item=> <li class = 'list' key={item} onClick={() => this.changeType(item)}>{item}</li>)}
      </ul>
    </header>
  }
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {type:[]};
  }

  handleHeaderCallback = type =>{
    console.log('header send type '+type+' to parent')
    // 4. parent传递type给child2
    this.setState({type})

  }

  render() {
    const {type} = this.state;
    return <div>
      <Header callback={this.handleHeaderCallback} />
      <Body type={type} />
    </div>;
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('container')
);