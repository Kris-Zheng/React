
class Body extends React.Component {
  constructor(props) {
    super(props)
    this.state = { page: 1 };
  }


  componentDidMount() {

    //监听是否滚动到底，从而加载第二页数据
    window.addEventListener("scroll", async () => {
      console.log('scroll')
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      //避免没有数据的时候 重复执行 scrollHeight > clientHeight
      if (scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {
        //加载下一页数据
        const { handleNextPage } = this.props;
        const { page } = this.state;
        handleNextPage(page + 1)
        this.setState({ page: page + 1 })
      }
    })
  }

  render() {
    const { type } = this.props;
    // 5. 查看child2是否成功获取到数值
    console.log('body got type ' + type);
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

    /**
 * 瀑布流
 * 1. 监听页面滚动到底部了
 * 2. 获取下一页数据
 * 3. 将数据填充进页面
 *   3-1. 原来使用的是setState({data})
 *   3-2. data.push('第二页的数据') -> setState({data})
 */

    const list = type.map((item, key) =>
      <li key={item.id} style={{ padding: 50, backgroundColor: '#f6f6f6', margin: 5, listStyle: 'none' }}>
        <h3 style={{ textAlign: 'center' }}>#{key + 1}</h3>
        <img src={item.owner.avatar_url} width="335" height="335"></img>
        <h4 style={{ textAlign: 'center', color: 'red' }}>{item.name}</h4>
        <p><i className="fa fa-user"></i> {item.name}</p>
        <p><i className="fa fa-star"></i>{item.stargazers_count} stars</p>
        <p><i className="fa fa-code-fork"></i>{item.forks} forks</p>
        <p><i className="fa fa-warning"></i>{item.open_issues} open issues</p>
      </li>
    );

    return <main>
      <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
        {list}
      </ul>
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </main>;
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = { type: 'All' };
  }

  types = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

  componentDidMount() {
    this.changeType('All')
  }

  changeType = (type, page = 1) => {

    // 1. 获取到当前点击的类型
    // 2. 再一次通过api获取该类型的数据
    // 3. 把获取到的数据填充进RepoList
    /*
      parent
       | child1
       | child2
      goal: child1 <-> child2
      way:
       1. child1 -> parent (callback)
       2. parent -> child2 (props)
    */

    // 1. child1 获取到需要传递给parent的值
    console.log(type)
    // 2. 尝试将数组传给parent
    // 2-1. 此时传递的不再是type, 而是获取到的数据
    const baseUrl = `https://api.github.com/search/repositories?q=stars:%3E1+language:${type}&sort=stars&order=desc&type=Repositories&page=${page}`
    axios.get(baseUrl)
      .then(res => {
        // 3. 回调parent为该child1准备的方法
        this.props.callback(res.data.items, type)
      })
  }


  render() {
    return <header>
      <div className='list'>
      <ul>
        {this.types.map(item =><li key={item} onClick={() => this.changeType(item)}>{item}</li>)}
      </ul>
      </div>
    </header>
  }
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = { type: [], currentType: 'All' };
  }

  handleHeaderCallback = (type, currentType) => {
    console.log('header send type ' + type + ' to parent')
    // 4. parent传递type给child2
    this.setState({ type, currentType })

  }

  handleNextPage = page => {
    // console.log(page)
    const { currentType } = this.state;
    console.log(`加载第${page},类型为${currentType}`)
    /**
     * todo:
     * 1. 解决冗余
     * 2. 变量命名规范
     * 3. 骨架页面（数据未加载出来的过渡动画）
     */


    // 1. 事件监听时，区别于原生的js,需要在react的基础上做监听
    // 2. 监听到底部时候，不仅要保留原有数据，还要将下一页数据push进去
    // [...type,...res.data.items] es6 解构赋值
    // res.data.items.map(i=>type.push(i))
    // 3. 切换类型的时候需要回到第一页，并清空其他数据
    // promise
    const that = this;
    const baseUrl = `https://api.github.com/search/repositories?q=stars:%3E1+language:${currentType}&sort=stars&order=desc&type=Repositories&page=${page}`
    axios.get(baseUrl)
      .then(res => {
        // 3. 回调parent为该child1准备的方法
        let { type } = that.state;
        // console.log(res)
        type = [...type, ...res.data.items]
        console.log(type)
        that.setState({ type })
      })

  }

  render() {
    const { type, currentType } = this.state;
    return <div>
      <Header callback={this.handleHeaderCallback} />
      <Body type={type} handleNextPage={this.handleNextPage} currentType={currentType} />
    </div>;
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('container')
);