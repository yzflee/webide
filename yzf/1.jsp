<dependency>
    <groupId>org.eclipse.jgit</groupId>
    <artifactId>org.eclipse.jgit</artifactId>
    <version>5.3.0.201903130848-r</version>
</dependency>

<dependency>
    <groupId>org.eclipse.jgit</groupId>
    <artifactId>org.eclipse.jgit</artifactId>
    <version>5.3.0.201903130848-r</version>
</dependency>

<dependency>
    <groupId>com.jcraft</groupId>
    <artifactId>jsch</artifactId>
    <version>0.1.54</version>
</dependency>

//创建本地git仓库
public static void create(String initUrl) throws IOException
{
    Repository repository = FileRepositoryBuilder.create(new File(initUrl + "/.git"));
    repository.create();
}

//clone git 仓库
public static void clone(String name,String password,String gitUrl,String localUrl)throws GitAPIException
{
    UsernamePasswordCredentialsProvider usernamePasswordCredentialsProvider=getAuthen(name,password);
    CloneCommand cloneCommand=Git.cloneRepository();
    Git git=cloneCommand.setURL(gitUrl).setBranch("master").setDirectory(new File(localUrl)).setCredentialsProvider(usernamePasswordCredentialsProvider).call();
    System.out.println(git.tag());
}

//添加文件到git
public static void add(String localUrl,String fileName)throws IOException,GitAPIException
{
    File testAddFile = new File(localUrl+"/"+filename);
    testAddFile.createNewFile();
    Git git=new Git(new FileRepository(localUrl+"/.git"));
    git.add().addFilepattern(fileName).call();
}

//提交文件
public static void commit(String localUrl,String message)throws IOException,GitAPIException
{
    Git git=new Git(new FileRepository(iocalUrl+"/.git"));
    git.commit().setMessage(message).call();
}

//push
public static void push(String name,String password,String localUrl)throws GitAPIException,IOException
{
    UsernamePasswordCredentialsProvider usernamePasswordCredentialsProvider=getAuthen(name,password);
    Git git=new Git(new FileRepository(localUrl+"/.git"));
    git.push().setRemote("origin").setCredentialsProvider(usernamePasswordCredentialsProvider).call();
}